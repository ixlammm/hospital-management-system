import { Dispatch, SetStateAction, useEffect, useState, useTransition } from "react";

export default function useAsyncArray<T>(af: () => Promise<T[] | undefined>) {
    const [data, setData] = useState<T[]>([]);
    const [loading, startTransition] = useTransition()

    useEffect(() => {
        startTransition(async () => {
            try {
                const data = await af()
                if (data) {
                    setData(data)
                }
            } catch (error) {
                console.error(error)
            }
        })
    }, [])

    return { data, setData, loading }
}