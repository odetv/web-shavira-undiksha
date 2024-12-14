// src/components/EditUserModal.tsx
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Form, Input, Select, SelectItem, Alert } from "@nextui-org/react";
import PersonIcon from '@mui/icons-material/Person';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

type EditUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: any) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  showConfirmPassword: boolean;
  toggleShowConfirmPassword: () => void;
  selectedUser: any;
};

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, onSubmit, showPassword, toggleShowPassword, showConfirmPassword, toggleShowConfirmPassword, selectedUser }) => {
  const handleSubmit = () => {
    const userData = {}; // Ambil data yang baru
    onSubmit(userData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent className="p-4">
        <ModalHeader className="flex justify-center">
          <Alert color="warning">Perbarui Data Pengguna</Alert>
        </ModalHeader>
        <ModalBody>
          <Form>
            <Input
              className="mb-4"
              label="Nama"
              value={selectedUser?.nama || ''}
              onChange={(e) => {}}
              endContent={<PersonIcon color="disabled" />}
            />
            <Input
              className="mb-4"
              label="Password"
              placeholder="Masukkan password baru"
              type={showPassword ? "text" : "password"}
              endContent={
                <button type="button" onClick={toggleShowPassword}>
                  {showPassword? (
                      <RemoveRedEyeIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <VisibilityOffIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                </button>
              }
            />
            <Input
              className="mb-4"
              label="Konfirmasi Password"
              placeholder="Ketik ulang password baru"
              type={showConfirmPassword ? "text" : "password"}
              endContent={
                <button type="button" onClick={toggleShowConfirmPassword}>
                  {showConfirmPassword? (
                      <RemoveRedEyeIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <VisibilityOffIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                </button>
              }
            />
            <Select
                label="Role"
                className="mb-4"
                isRequired
                labelPlacement="outside"
                defaultSelectedKeys={[selectedUser?.role || '']}
                value={selectedUser?.role || ''}
              >
                <SelectItem key="admin" value="admin">Admin</SelectItem>
                <SelectItem key="member" value="member">Member</SelectItem>
                <SelectItem key="registered" value="registered">Registered</SelectItem>
              </Select>
              <Select
                label="Status"
                className="mb-4"
                isRequired
                labelPlacement="outside"
                defaultSelectedKeys={[selectedUser?.status || '']}
                value={selectedUser?.status || ''}
              >
                <SelectItem key="active" value="active">Aktif</SelectItem>
                <SelectItem key="suspend" value="suspend">Suspend</SelectItem>
              </Select>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>Batal</Button>
          <Button color="primary" onPress={handleSubmit}>Simpan</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditUserModal;
