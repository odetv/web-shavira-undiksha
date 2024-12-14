// src/components/AddUserModal.tsx
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Form, Input, Select, SelectItem, Alert } from "@nextui-org/react";
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: any) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  showConfirmPassword: boolean;
  toggleShowConfirmPassword: () => void;
};

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSubmit, showPassword, toggleShowPassword, showConfirmPassword, toggleShowConfirmPassword }) => {
  const handleSubmit = () => {
    // Ganti dengan logika untuk mengambil data dari form
    const userData = {}; 
    onSubmit(userData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent className="p-2">
        <ModalHeader>
          <Alert color="primary">Tambah Akun Pengguna</Alert>
        </ModalHeader>
        <ModalBody>
          <Form>
            <Input
              isRequired
              label="Nama Lengkap"
              className="mb-1"
              labelPlacement="outside"
              placeholder="Masukkan nama lengkap"
              endContent={<PersonIcon color="disabled" />}
            />
            <Input
              isRequired
              className="mb-1"
              label="Email"
              labelPlacement="outside"
              placeholder="Masukkan email"
              endContent={<EmailIcon color="disabled" />}
            />
            <Input
              isRequired
              className="mb-1"
              label="Password"
              labelPlacement="outside"
              placeholder="Masukkan password"
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
              isRequired
              className="mb-1"
              label="Konfirmasi Password"
              labelPlacement="outside"
              placeholder="Konfirmasi password"
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
            <Select isRequired label="Role" className="mb-1" labelPlacement="outside" defaultSelectedKeys={["registered"]}>
              <SelectItem key="admin" value="admin">Admin</SelectItem>
              <SelectItem key="member" value="member">Member</SelectItem>
              <SelectItem key="registered" value="registered">Registered</SelectItem>
            </Select>
            <Select isRequired label="Status" className="mb-1" labelPlacement="outside" defaultSelectedKeys={["active"]}>
              <SelectItem key="active" value="active">Active</SelectItem>
              <SelectItem key="suspend" value="suspend">Suspend</SelectItem>
            </Select>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>Batal</Button>
          <Button color="primary" onPress={handleSubmit}>Tambah</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddUserModal;


