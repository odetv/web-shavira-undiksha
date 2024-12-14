// src/components/DeleteUserModal.tsx
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Alert } from "@nextui-org/react";

type DeleteUserModalProps = {
  isOpen: boolean; // Menyimpan keadaan apakah posisi modal tertutup atau terbuka
  onClose: () => void; // Fungsi untuk menutup modal
  onDelete: () => void;
  selectedUser: any;
};

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ isOpen, onClose, onDelete, selectedUser }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent className="p-8">
        <ModalHeader>
          <Alert color="danger">Konfirmasi Hapus Akun</Alert>
        </ModalHeader>
        <ModalBody className="flex text-center">
          Apakah kamu yakin ingin menghapus pengguna ini?<strong>{selectedUser?.nama}</strong> perubahan ini akan bersifat permanen
        </ModalBody>
        <ModalFooter className="flex justify-center gap-5">
          <Button color="default" size="lg" onPress={onClose}>Batal</Button>
          <Button color="danger" size="lg" onClick={onDelete}>Hapus</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteUserModal;
