import { toast } from "@/components/ui/toast";

export const useToast = () => {
    return {
        toast: (props: {
            title: string;
            description?: string;
            variant?: "default" | "destructive";
        }) => {
            toast(props);
        }
    };
}; 