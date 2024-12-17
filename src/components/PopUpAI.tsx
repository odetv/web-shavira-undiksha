import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

export default function PopUpAI() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("shavira_consent");
    if (!hasAccepted) {
      setIsModalOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("shavira_consent", "true");
    setIsModalOpen(false);
  };

  return (
    <Modal
      backdrop="opaque"
      isOpen={isModalOpen}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      placement="bottom"
      hideCloseButton={true}
      size="lg"
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent className="m-2">
        <div className="flex flex-row gap-2 justify-center items-center p-1">
          <ModalBody>
            <p className="text-sm">
              Jawaban dihasilkan oleh AI mungkin saja keliru, harap verifikasi
              kembali hasil yang didapatkan.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              className="text-sm animate-pulse"
              color="primary"
              size="sm"
              onPress={handleAccept}
            >
              Mengerti
            </Button>
          </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  );
}
