import useAsyncArray from "@/hooks/use-asyncarray";
import { Badge } from "../ui/badge";
import { useI18n } from "@/lib/i18n";
import { LoaderCircle } from "lucide-react";

export default function Total<T>(props: {
    array: ReturnType<typeof useAsyncArray<T>>,
}) {
    const { t } = useI18n()

    return <Badge variant="outline" className="ml-2">
        {
            props.array.loading ? <LoaderCircle className="animate-spin" /> :
            props.array.data.length
        } {t("common.total")}
    </Badge>
}