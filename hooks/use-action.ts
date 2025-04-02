import { TransitionFunction, TransitionStartFunction, useState, useTransition } from "react";

export function useAction<T, K extends Array<any>>(action: (...args: K) => Promise<T | null>) {
    const [ loading, startTransition ] = useTransition()
    const [ result, setResult ] = useState<T | null>(null)
    const [ error, setError ] = useState<string | null>(null)

    const run = (...args: K) => {
        startTransition(async () => {
            try {
                setResult(await action(...args))
            } catch (error) {
                setError(String(error))
            }
        })
    }

    return { loading, result, error, run }
}