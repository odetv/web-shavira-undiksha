"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Pagination,
  Modal,
  ModalContent,
  ModalBody,
  Alert,
  ModalHeader,
  ModalFooter,
  Form,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessChecker from "@/components/AccessChecker";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoBackHome from "@/components/GoBackHome";
import GoBackAdmin from "@/components/GoBackAdmin";
import LockResetIcon from "@mui/icons-material/LockReset";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import GoogleIcon from "@mui/icons-material/Google";
import {
  createUser,
  readUsers,
  quickUpdateUserRole,
  resetPassword,
  updateUser,
} from "@/services/apiDatabase";
import { auth } from "@/services/firebase";
import LoadingIcon from "@/assets/gif/Rolling@1x-1.0s-200px-200px.gif";
import Image from "next/image";

type User = {
  uid: string;
  name: string;
  email: string;
  type_user: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export default function ManagementUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loadingSync, setLoadingSync] = useState<boolean>(false);
  const [isAddUserActive, setAddUserActive] = useState(false);
  const [isDeleteUserActive, setDeleteUserActive] = useState(false);
  const [isResetUserActive, setResetUserActive] = useState(false);
  const [isEditUserActive, setEditUserActive] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [page, setPage] = React.useState(1);

  const [nameCreateUserManual, setNameCreateUserManual] = useState("");
  const [emailCreateUserManual, setEmailCreateUserManual] = useState("");
  const [passwordCreateUserManual, setPasswordCreateUserManual] = useState("");
  const [confirmPasswordCreateUserManual, setConfirmPasswordCreateUserManual] =
    useState("");
  const [photoUrlCreateUserManual, setPhotoUrlCreateUserManual] = useState("");
  const [roleCreateUserManual, setRoleCreateUserManual] = useState<string>("");
  const [statusCreateUserManual, setStatusCreateUserManual] =
    useState<string>("");

  const isCreateUserEnabled =
    nameCreateUserManual !== "" &&
    emailCreateUserManual !== "" &&
    passwordCreateUserManual !== "" &&
    confirmPasswordCreateUserManual !== "" &&
    passwordCreateUserManual === confirmPasswordCreateUserManual &&
    photoUrlCreateUserManual !== "" &&
    roleCreateUserManual !== "" &&
    statusCreateUserManual !== "";

  useEffect(() => {
    if (!photoUrlCreateUserManual) {
      setPhotoUrlCreateUserManual(
        "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
      );
    }
  }, [photoUrlCreateUserManual]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await readUsers();
        setUsers(usersData || []);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleSync = async () => {
    setLoadingSync(true);
    const usersData = await readUsers();
    setUsers(usersData || []);
    setLoadingSync(false);
  };

  const handleCreateUserManual = async () => {
    if (passwordCreateUserManual !== confirmPasswordCreateUserManual) {
      alert("Password dan konfirmasi password tidak cocok.");
      return;
    }
    try {
      const user = await createUser(
        nameCreateUserManual,
        emailCreateUserManual,
        passwordCreateUserManual,
        photoUrlCreateUserManual,
        roleCreateUserManual,
        statusCreateUserManual
      );
      setUsers((prevUsers) => [...prevUsers, user]);
      setAddUserActive(false);
      window.location.reload();
    } catch (error: any) {
      alert("Terjadi kesalahan: " + error.message);
    }
  };

  const handleResetAccount = async () => {
    if (!selectedUser) {
      alert("Pengguna tidak ditemukan");
      return;
    }
    try {
      const message = await resetPassword(selectedUser.email);
      alert(message);
      closeResetUserModal();
    } catch (error: any) {
      console.error("Error: ", error);
      alert(error.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) {
      alert("Pengguna tidak ditemukan");
      return;
    }
    try {
      const response = await fetch("/api/db/delete-user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: selectedUser.uid }),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        setDeleteUserActive(false);
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.uid !== selectedUser.uid)
        );
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Terjadi kesalahan saat menghapus pengguna.");
      setDeleteUserActive(false);
    }
  };

  const handleQuickRoleChange = async (userId: string, newRole: string) => {
    try {
      await quickUpdateUserRole(userId, newRole);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === userId ? { ...user, role: newRole } : user
        )
      );
      alert("Role berhasil diubah menjadi " + newRole);
    } catch (error) {
      alert("Terjadi kesalahan saat mengupdate role pengguna.");
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) {
      alert("Pengguna tidak ditemukan");
      return;
    }

    try {
      const response = await updateUser(
        selectedUser.uid,
        selectedUser.name,
        selectedUser.role,
        selectedUser.status
      );
      alert(response.message);
      setEditUserActive(false);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === selectedUser.uid
            ? {
                ...user,
                name: selectedUser.name,
                role: selectedUser.role,
                status: selectedUser.status,
              }
            : user
        )
      );
    } catch (error) {
      alert("Terjadi kesalahan saat memperbarui pengguna");
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const hideAllPassword = () => {
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const rowsPerPage = 10;
  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    if (!searchQuery) return users;
    return users.filter(
      (user: any) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.type_user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, users]);
  const pages = Math.ceil(filteredUsers.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredUsers.slice(start, end);
  }, [page, filteredUsers]);

  const openAddUserModal = () => setAddUserActive(true);
  const closeAddUserModal = () => {
    setSelectedUser(null);
    setAddUserActive(false);
  };

  const openResetUserModal = (user: User) => {
    setSelectedUser(user);
    setResetUserActive(true);
  };
  const closeResetUserModal = () => {
    setSelectedUser(null);
    setResetUserActive(false);
  };

  const openDeleteUserModal = (user: User) => {
    setSelectedUser(user);
    setDeleteUserActive(true);
  };
  const closeDeleteUserModal = () => {
    setSelectedUser(null);
    setDeleteUserActive(false);
  };

  const openEditUserModal = (user: User) => {
    setSelectedUser(user);
    setEditUserActive(true);
  };
  const closeEditUserModal = () => {
    hideAllPassword();
    setSelectedUser(null);
    setEditUserActive(false);
  };

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
      <div className="text-center text-black tracking-wide">
        <h1 className="text-3xl sm:text-5xl font-bold pb-2">
          Manajemen Pengguna
        </h1>
      </div>
      <div className="pt-6 w-full flex flex-col gap-6">
        <div>
          <div className="pb-4 flex justify-end"></div>
          <Table
            className="w-full overflow-auto"
            aria-label="Manajement Users"
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
              <div className="flex flex-wrap w-full justify-start sm:justify-end gap-2">
                {/* Tombol Open Add User Modal */}
                <button
                  onClick={openAddUserModal}
                  className="flex items-center bg-primary-500 text-white px-3 py-2 rounded-lg hover:bg-primary-400 transition-all ease-in-out"
                >
                  <PersonAddAlt1Icon />
                </button>
                <button
                  className={`text-white font-semibold px-4 py-2 rounded-xl text-sm flex justify-center items-center gap-1 cursor-pointer transition-all ease-in-out ${
                    loadingSync
                      ? "bg-green-400"
                      : "bg-green-500 hover:bg-green-400"
                  }`}
                  onClick={handleSync}
                  disabled={loadingSync}
                >
                  {loadingSync ? (
                    <Image
                      width={20}
                      height={20}
                      src={LoadingIcon.src}
                      alt={"Loading"}
                    />
                  ) : (
                    ""
                  )}
                  Sync
                </button>
                <Input
                  isClearable
                  className="w-full sm:max-w-[25%] max-w-[55%]"
                  placeholder="Cari Pengguna"
                  startContent={<SearchIcon color="disabled" />}
                  onClear={() => onClear()}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            }
          >
            <TableHeader>
              <TableColumn className="uppercase">No</TableColumn>
              <TableColumn className="uppercase">Nama</TableColumn>
              <TableColumn className="uppercase">Email</TableColumn>
              <TableColumn className="uppercase">Tipe Akun</TableColumn>
              <TableColumn className="uppercase">Role</TableColumn>
              <TableColumn className="uppercase">Status</TableColumn>
              <TableColumn className="uppercase">
                Waktu Dibuat (WITA)
              </TableColumn>
              <TableColumn className="uppercase">
                Waktu Diperbarui (WITA)
              </TableColumn>
              <TableColumn className="uppercase">Aksi</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"Pengguna tidak ditemukan"}>
              {items.map((user, index) => (
                <TableRow key={user.uid}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell className="flex flex-row justify-start items-center gap-3 pr-12 sm:pr-0">
                    <Image
                      className="rounded-full p-0.5 outline-slate-300 outline-2 outline"
                      width={40}
                      height={40}
                      alt={user.name}
                      src={user.photo_url}
                    />
                    <p>{user.name}</p>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize text-center text-slate-500">
                    {user.type_user === "google" ? (
                      <GoogleIcon />
                    ) : (
                      <EmailIcon />
                    )}
                  </TableCell>
                  <TableCell>
                    {user.uid === auth.currentUser?.uid ? (
                      <p className="capitalize pl-3">{user.role}</p>
                    ) : (
                      <Form className="w-32">
                        <Select
                          isRequired
                          labelPlacement="outside"
                          aria-label="role"
                          defaultSelectedKeys={[user.role]}
                          value={user.role}
                          onChange={(e) =>
                            handleQuickRoleChange(user.uid, e.target.value)
                          }
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
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    {user.status == "active" ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                  </TableCell>
                  <TableCell>{user.created_at}</TableCell>
                  <TableCell>{user.updated_at}</TableCell>
                  <TableCell className="flex gap-2">
                    {user.uid !== auth.currentUser?.uid ? (
                      <>
                        <Button
                          isIconOnly
                          color="success"
                          onPress={() => openEditUserModal(user)}
                        >
                          <EditIcon className="text-white" />
                        </Button>
                        <Button
                          isIconOnly
                          color="warning"
                          onPress={() => openResetUserModal(user)}
                        >
                          <LockResetIcon className="text-white" />
                        </Button>
                        <Button
                          isIconOnly
                          color="danger"
                          onPress={() => openDeleteUserModal(user)}
                        >
                          <DeleteIcon className="text-white" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          isIconOnly
                          color="warning"
                          onPress={() => openResetUserModal(user)}
                        >
                          <LockResetIcon className="text-white" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 pt-6 justify-center items-center">
        <GoBackAdmin />
        <GoBackHome />
      </div>

      {/* Tampilan Modal untuk Add User */}
      <Modal
        placement="center"
        backdrop="opaque"
        isOpen={isAddUserActive}
        onOpenChange={closeAddUserModal}
        className="mt-8 m-2"
      >
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
                name="name"
                placeholder="Masukkan Nama Lengkap"
                type="text"
                endContent={<PersonIcon color="disabled" />}
                value={nameCreateUserManual}
                onChange={(e) => setNameCreateUserManual(e.target.value)}
              />
              <Input
                isRequired
                className="mb-1"
                label="Email"
                labelPlacement="outside"
                name="email"
                placeholder="Masukkan Email"
                type="email"
                endContent={<EmailIcon color="disabled" />}
                value={emailCreateUserManual}
                onChange={(e) => setEmailCreateUserManual(e.target.value)}
              />
              <Input
                isRequired
                className="mb-1"
                label="Password"
                labelPlacement="outside"
                name="password"
                placeholder="Masukkan Password"
                type={showPassword ? "text" : "password"}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? (
                      <RemoveRedEyeIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <VisibilityOffIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                value={passwordCreateUserManual}
                onChange={(e) => setPasswordCreateUserManual(e.target.value)}
              />
              <Input
                isRequired
                className="mb-1"
                label="Konfirmasi Password"
                labelPlacement="outside"
                name="confirmPassword"
                placeholder="Konfirmasi Password"
                type={showConfirmPassword ? "text" : "password"}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleShowConfirmPassword}
                  >
                    {showConfirmPassword ? (
                      <RemoveRedEyeIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <VisibilityOffIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                value={confirmPasswordCreateUserManual}
                onChange={(e) =>
                  setConfirmPasswordCreateUserManual(e.target.value)
                }
              />
              <Select
                isRequired
                className="mb-1"
                label="Role"
                placeholder="Pilih Role"
                labelPlacement="outside"
                name="role"
                value={roleCreateUserManual}
                onChange={(e) => setRoleCreateUserManual(e.target.value)}
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
              <Select
                isRequired
                className="mb-1"
                label="Status"
                placeholder="Pilih Status"
                labelPlacement="outside"
                name="status"
                value={statusCreateUserManual}
                onChange={(e) => setStatusCreateUserManual(e.target.value)}
              >
                <SelectItem key="active" value="active">
                  Aktif
                </SelectItem>
                <SelectItem key="suspend" value="suspend">
                  Blokir
                </SelectItem>
              </Select>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              size="lg"
              onPress={closeAddUserModal}
            >
              Batal
            </Button>
            <button
              className={`rounded-2xl px-6 py-2 text-white 
              ${
                isCreateUserEnabled
                  ? "bg-blue-500 hover:bg-blue-400"
                  : "bg-blue-300 cursor-not-allowed"
              }`}
              onClick={handleCreateUserManual}
              disabled={!isCreateUserEnabled}
            >
              Tambah
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Untuk Reset User */}
      <Modal
        placement="center"
        backdrop="opaque"
        isOpen={isResetUserActive}
        onOpenChange={closeResetUserModal}
        className="m-2"
      >
        <ModalContent className="p-8">
          <ModalHeader>
            <Alert color="danger">Konfirmasi Reset Akun</Alert>
          </ModalHeader>
          <ModalBody className="flex text-center">
            Apakah kamu yakin ingin mereset akun pengguna ini?
            <strong>{selectedUser?.name}</strong>
            Link reset password akan dikirimkan ke email ini{" "}
            <strong>{selectedUser?.email}</strong>
          </ModalBody>
          <ModalFooter className="flex justify-center gap-5">
            <Button
              color="default"
              size="lg"
              className="font-semibold"
              onPress={closeResetUserModal}
            >
              Batal
            </Button>
            <Button
              color="warning"
              size="lg"
              className="font-semibold"
              onPress={handleResetAccount}
            >
              Reset
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Untuk Delete User */}
      <Modal
        placement="center"
        backdrop="opaque"
        isOpen={isDeleteUserActive}
        onOpenChange={closeDeleteUserModal}
        className="m-2"
      >
        <ModalContent className="p-8">
          <ModalHeader>
            <Alert color="danger">Konfirmasi Hapus Akun</Alert>
          </ModalHeader>
          <ModalBody className="flex text-center">
            Apakah kamu yakin ingin menghapus pengguna ini?
            <strong>{selectedUser?.name}</strong> perubahan ini akan bersifat
            permanen{" "}
          </ModalBody>
          <ModalFooter className="flex justify-center gap-5">
            <Button
              color="default"
              size="lg"
              className="font-semibold"
              onPress={closeDeleteUserModal}
            >
              Batal
            </Button>
            <Button
              color="danger"
              size="lg"
              className="font-semibold"
              onPress={handleDeleteUser}
            >
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal untuk Edit User */}
      <Modal
        placement="center"
        backdrop="opaque"
        isOpen={isEditUserActive}
        onOpenChange={closeEditUserModal}
        className="m-2"
      >
        <ModalContent className="p-4">
          <ModalHeader className="flex justify-center">
            <Alert color="warning" title="">
              Perbarui Data Pengguna
            </Alert>
          </ModalHeader>
          <ModalBody>
            <Form>
              <Input
                className="mb-4"
                label="Nama"
                isRequired
                labelPlacement="outside"
                placeholder="Masukkan Nama Lengkap"
                value={selectedUser?.name || ""}
                endContent={<PersonIcon color="disabled" />}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser!, name: e.target.value })
                }
              />
              <Select
                label="Role"
                className="mb-4"
                isRequired
                labelPlacement="outside"
                placeholder="Pilih Role"
                defaultSelectedKeys={[selectedUser?.role || ""]}
                value={selectedUser?.role || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser!, role: e.target.value })
                }
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
              <Select
                label="Status"
                className="mb-4"
                isRequired
                labelPlacement="outside"
                placeholder="Pilih Status"
                defaultSelectedKeys={[selectedUser?.status || ""]}
                value={selectedUser?.status || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser!, status: e.target.value })
                }
              >
                <SelectItem key="active" value="active">
                  Aktif
                </SelectItem>
                <SelectItem key="suspend" value="suspend">
                  Blokir
                </SelectItem>
              </Select>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              size="lg"
              className="font-semibold"
              onPress={closeEditUserModal}
            >
              Batal
            </Button>
            <Button
              color="primary"
              size="lg"
              className="font-semibold"
              onPress={handleEditUser}
            >
              Perbarui
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </main>
  );
}
