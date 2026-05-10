/**
 * isolated-vm の Isolate プール。
 *
 * 各 Isolate は使い回さず、release 時に dispose して新しく作る。
 * これによりテスト間で副作用が残らない (前のテストのグローバルが見える等を防ぐ)。
 *
 * プールサイズ分の Isolate が常時用意されているので、acquire は通常即座に返る。
 */

import ivm from "isolated-vm";

interface PoolOptions {
  size: number;
  /** 1 Isolate のメモリ上限 (MB) */
  memoryLimit: number;
}

export class IsolatePool {
  private readonly available: ivm.Isolate[] = [];
  private readonly opts: PoolOptions;
  private waitingResolvers: Array<(iso: ivm.Isolate) => void> = [];

  constructor(opts: PoolOptions) {
    this.opts = opts;
    for (let i = 0; i < opts.size; i++) {
      this.available.push(new ivm.Isolate({ memoryLimit: opts.memoryLimit }));
    }
  }

  async acquire(): Promise<ivm.Isolate> {
    const iso = this.available.pop();
    if (iso) {return iso;}

    // プール枯渇時はキューに並ぶ
    return new Promise<ivm.Isolate>((resolve) => {
      this.waitingResolvers.push(resolve);
    });
  }

  release(iso: ivm.Isolate): void {
    // 古い Isolate は dispose
    try {
      iso.dispose();
    } catch {
      // already disposed
    }
    const fresh = new ivm.Isolate({ memoryLimit: this.opts.memoryLimit });

    // 待機しているリクエストがあれば即座に渡す
    const waiter = this.waitingResolvers.shift();
    if (waiter) {
      waiter(fresh);
      return;
    }
    this.available.push(fresh);
  }

  /** プロセス終了時のクリーンアップ */
  shutdown(): void {
    for (const iso of this.available) {
      try {
        iso.dispose();
      } catch {
        // ignore
      }
    }
    this.available.length = 0;
  }
}
