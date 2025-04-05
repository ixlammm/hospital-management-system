import { Dispatch, SetStateAction, useEffect, useState, useTransition } from "react";

export default function useAsyncArray<T>(af: () => Promise<T[] | undefined>) {
    const [data, setData] = useState<T[]>([]);
    const [loading, startTransition] = useTransition()

    useEffect(() => {
        startTransition(async () => {
            af().then((data) => {
                if (data) {
                    setData(data)
                }
            }
            ).catch((error) => {
                console.log("ERRROR")
            })
        })
}, [])

return { data, setData, loading }
}