import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  return (
    <form className="flex w-full max-w-xl items-center space-x-2">
      <Input
        type="email"
        placeholder="Email"
        className="flex-1"
      />
      <Button type="submit">
        Odebírat
      </Button>
    </form>
  );
}
