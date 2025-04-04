import { useState } from "react"

export default function useNamedState<S>(initial: S | (() => S)) {
    const [value, update] = useState<S>(initial)

    return { value, update }
}