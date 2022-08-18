type LazyLoadDecorator = (arg0: Element, arg1: string | symbol, arg2: PropertyDescriptor) => PropertyDescriptor;

const defaultLazyLoadOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: [0.5], // 50% of the element is visible.
};

export function LazyLoad(options: IntersectionObserverInit = defaultLazyLoadOptions): LazyLoadDecorator {
    return (target: Element, _propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const originalMethod: any = descriptor.value;

        const lazyLoadObserver = new IntersectionObserver((entries: IntersectionObserverEntry[]): void => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    lazyLoadObserver.unobserve(entry.target);
                    originalMethod.apply(target);
                }
            }
        }, options);
        lazyLoadObserver.observe(target);

        return descriptor;
    };
}
