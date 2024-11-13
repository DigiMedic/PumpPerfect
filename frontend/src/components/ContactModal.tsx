import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Phone, MapPin } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Kontaktní údaje</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-medium">E-mail</h3>
              <a href="mailto:info@digimedic.cz" className="text-primary hover:underline">
                info@digimedic.cz
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-medium">Telefon</h3>
              <a href="tel:+420774517607" className="text-primary hover:underline">
                +420 774 517 607
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-medium">Adresa</h3>
              <p>Spáčilova 582/21, 618 00 Brno-Černovice</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 