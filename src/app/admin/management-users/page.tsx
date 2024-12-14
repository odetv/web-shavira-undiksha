"use client";
import { useEffect, useState } from "react";
import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Pagination, getKeyValue, Modal, ModalContent, ModalBody, Alert, ModalHeader, ModalFooter, Form, Input, Select, SelectItem} from "@nextui-org/react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessChecker from "@/components/AccessChecker";
import SearchIcon from "@mui/icons-material/Search";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoBackHome from "@/components/GoBackHome";
import GoBackAdmin from "@/components/GoBackAdmin";
import AddUserModal from "@/components/modal/AddUserModal";
import DeleteUserModal from "@/components/modal/DeleteUserModal";
import EditUserModal from "@/components/modal/EditUserModal";

type User = {
  nama: string;
  email: string;
  tipe_login: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
};

// Contoh data dummy
const users = [
  {
    id: 1,
    nama: "gelgel",
    email: "gelgel@example.com",
    tipe_login: "Manual",
    role: "admin",
    status: "active",
    created_at: '2023-12-12 00:00:00',
    updated_at: '2024-12-12 00:00:00'
  },
  {
    id: 2,
    nama: 'Diar',
    email: 'sudiar@example.com',
    tipe_login: 'Google',
    role: 'admin',
    status: 'active',
    created_at: '2023-12-12 00:00:00',
    updated_at: '2024-12-12 00:00:00'
  },
  {
    id: 3,
    nama: 'Alya',
    email: 'alyad@example.com',
    tipe_login: 'Google',
    role: 'member',
    status: 'suspend',
    created_at: '2023-12-12 00:00:00',
    updated_at: '2024-12-12 00:00:00'
  }
]

export default function CheckModel() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddUserActive, setAddUserActive] = useState(false)
  const [isDeleteUserActive, setDeleteUserActive] = useState(false)
  const [isEditUserActive, setEditUserActive] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fungsi untuk menampilkan password
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  // Fungsi menyembunyikan semua password
  const hideAllPassword = () => {
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const filteredUsers = React.useMemo(() => {
    if (!searchQuery) return users;
    return users.filter((user) =>
      user.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.tipe_login.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);
  


  const pages = Math.ceil(filteredUsers.length / rowsPerPage); // Menggunakan filteredUsers untuk menghitung jumlah halaman

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredUsers.slice(start, end); // Menampilkan data yang sudah difilter
  }, [page, filteredUsers, rowsPerPage]);


  // Fungsi untuk mengelola Modal
  // 1. Modal Add User
  const openAddUserModal = () => setAddUserActive(true)
  const closeAddUserModal = () => {
    hideAllPassword();
    setAddUserActive(false)
  }
  
  // 2. Modal Delete User
  const openDeleteUserModal = (user: User) => {
    setSelectedUser(user);
    setDeleteUserActive(true)
  }
  const closeDeleteUserModal = () => {
    setSelectedUser(null);
    setDeleteUserActive(false)
  }

  // 3. Modal Edit User
  const openEditUserModal = (user: User) => {
    setSelectedUser(user);  // Menyimpan pengguna yang dipilih ke dalam state
    setEditUserActive(true); // Membuka modal edit
  };
  const closeEditUserModal = () => {
    hideAllPassword();
    setSelectedUser(null)
    setEditUserActive(false)
  }

  // Notifikasi Toast
  const handleAddUser = () => {
    // Tempat fungsi untuk menghapus pengguna
    // 
    // 
    closeAddUserModal();
    toast.success("Pengguna berhasil ditambahkan!");
  } 

  const handleDeleteUser = () => {
    // Tempat fungsi untuk menghapus pengguna
    // 
    // 
    closeDeleteUserModal();
    toast.success("Pengguna berhasil dihapus");
  }
  const handleEditUser = () => {
    // Tempat fungsi untuk mengperbarui pengguna
    // 
    // 
    closeDeleteUserModal();
    toast.success("Pengguna berhasil diperbarui!");
  }

  const onClear = React.useCallback(() => {
    setSearchQuery("");
  }, []);

  const [isValidKey, setIsValidKey] = useState<boolean>(false);
  const handleAccessChecked = (valid: boolean) => {
    setIsValidKey(valid);
  };
  if (!isValidKey) {
    return <AccessChecker onAccessChecked={handleAccessChecked} />;
  }

  return (
    <main className="flex flex-col items-center justify-center p-4 pt-6 mx-auto max-w-screen-xl 2xl:max-w-screen-2xl">
      <ToastContainer position="top-center"/>
      <div className="text-center text-black tracking-wide">
        <h1 className="text-3xl sm:text-5xl font-bold pb-2">
          Manajemen User
        </h1>
      </div>
      <div className="pt-6 w-full flex flex-col gap-6">
        <div>
          <div className="pb-4 flex justify-end">
          </div>
          <Table
            className="w-full"
            aria-label="Configuration Model"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={page}
                  total={pages}
                  onChange={setPage}
                />
              </div>
            }
            topContent={
              <div className="flex flex-wrap w-full justify-end gap-2 py-3">
                {/* Tombol Open Add User Modal */}
                <Button onPress={openAddUserModal} color="primary" className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-fill-add" viewBox="0 0 16 16">
                    <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                    <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                  </svg>
                  Add User
                </Button>
                <Input
                  isClearable
                  className="w-full sm:max-w-[25%] max-w-[55%]"
                  placeholder="Search"
                  startContent={<SearchIcon color="disabled" />}
                  onClear={() => onClear()}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

              </div>
            }
          >
            <TableHeader>
              <TableColumn>No</TableColumn>
              <TableColumn>Nama</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Tipe Login</TableColumn>
              <TableColumn>Role</TableColumn>
              <TableColumn>Status</TableColumn>
              <TableColumn>Waktu Dibuat</TableColumn>
              <TableColumn>Waktu Diperbarui</TableColumn>
              <TableColumn>Aksi</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"Konfigurasi tidak ditemukan."}>
              {items.map((user, index) => (
                <TableRow key={user.id}> 
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.nama}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.tipe_login}</TableCell>
                <TableCell>
                  <Form className="w-32">
                    <Select
                      isRequired
                      labelPlacement="outside"
                      aria-label="role"
                      defaultSelectedKeys={[user.role]}
                    >
                      <SelectItem key="admin" value="admin">
                        Admin
                      </SelectItem>
                      <SelectItem key="member" value="member">
                        Member
                      </SelectItem>
                      <SelectItem key="registered" value="registered">
                        Registered
                      </SelectItem>
                    </Select>
                  </Form>
                </TableCell>
                <TableCell>
                  {user.status == "active" ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                </TableCell>
                <TableCell>
                  {user.created_at}
                </TableCell>
                <TableCell>
                  {user.updated_at}
                </TableCell>
                <TableCell className="flex gap-2">
                  {/* Tombol Delete User */}
                  <Button isIconOnly color="danger" onPress={() => openDeleteUserModal(user) }>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFFFFF" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                    </svg>
                  </Button>

                  {/* Tombol Edit User */}
                  <Button isIconOnly color="warning" onPress={() => openEditUserModal(user)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFFFFF" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                    </svg>
                  </Button>
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-6 justify-center items-center">
        <GoBackHome />
        <GoBackAdmin />
      </div>

      {/* Tampilan Modal untuk Add User */}
      <AddUserModal 
        isOpen={isAddUserActive} 
        onSubmit={handleAddUser} 
        onClose={closeAddUserModal} 
        showPassword={showPassword} 
        toggleShowPassword={toggleShowPassword} 
        showConfirmPassword={showConfirmPassword} 
        toggleShowConfirmPassword={toggleShowConfirmPassword} 
      />

      {/* Modal Untuk Delete User */}
      <DeleteUserModal 
        isOpen={isDeleteUserActive} 
        onClose={closeDeleteUserModal} 
        onDelete={handleDeleteUser} 
        selectedUser={selectedUser} 
      />
      
      {/* Modal untuk Edit User */}
      <EditUserModal 
        isOpen={isEditUserActive} 
        onClose={closeEditUserModal} 
        onSubmit={handleEditUser} 
        showPassword={showPassword} 
        toggleShowPassword={toggleShowPassword} 
        showConfirmPassword={showConfirmPassword} 
        toggleShowConfirmPassword={toggleShowConfirmPassword} 
        selectedUser={selectedUser} 
      />
    </main>
  );
}
