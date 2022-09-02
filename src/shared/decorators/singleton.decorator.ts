/* eslint-disable @typescript-eslint/no-explicit-any */
const SINGLETON_KEY = Symbol();

type ClassType<T = any> = new (...args: any[]) => T;
type Constructor<T = any> = (...args: any[]) => T;
type ServiceConstraints<T = any> = ClassType<T> | Constructor<T>;
type Singleton<T extends Constructor | ClassType> = T & {
    [SINGLETON_KEY]: T extends ServiceConstraints<infer I> ? I : never;
};

export function Singleton() {
    return <T extends ServiceConstraints>(target: T): T => {
        return new Proxy<T>(target, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            construct(target: Singleton<T>, args: any[], newTarget: Constructor) {
                if (ifClassHasInheritance(target, newTarget)) {
                    // @NOTE: Skip proxy.
                    return Reflect.construct(target, args, newTarget);
                }
                if (!isInstanceDefined(target)) {
                    target[SINGLETON_KEY] = Reflect.construct(target, args, newTarget);
                }
                return target[SINGLETON_KEY];
            },
        });
    };
}

function isInstanceDefined(target: ServiceConstraints): boolean {
    return Object.getOwnPropertySymbols(target).includes(SINGLETON_KEY);
}

function ifClassHasInheritance(target: ServiceConstraints, newTarget: ServiceConstraints): boolean {
    return target.prototype !== newTarget.prototype;
}
