import { Dispatch, SetStateAction, useEffect, useState, useTransition } from "react";

export default function useAsyncArray<T>(af: () => Promise<T[] | undefined>) {
    const [data, setData] = useState<T[]>([]);
    const [loading, startTransition] = useTransition()

    useEffect(() => {
        startTransition(async () => {
            const data = await af()
            if (data) {
                setData(data)
            }
        })
    }, [])

    return { data, setData, loading }
}