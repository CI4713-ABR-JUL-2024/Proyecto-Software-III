'use client';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { roleSchema } from "@/zodSchema/role";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import Modal from "react-modal";

type Role = z.infer<typeof roleSchema>;

export default function EditRoleModal() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<Role>({
    resolver: zodResolver(roleSchema),
  });
  const [cookies, setCookie] = useCookies(["access_token"]);
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false); // State variable for modal open/close

  async function onSubmit(data: Role) {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Editar Rol</button>
      <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Rol:
            <select {...register("role")}>
              <option disabled className="text-gray-400" value="">
                Seleccione un rol
              </option>
              <option value="Gerente General">Gerente General</option>
              <option value="Gerente de Operaciones">
                Gerente de Operaciones
              </option>
              <option value="Sub-Gerente de Cuentas">
                Sub-Gerente de Cuentas
              </option>
              <option value="Analista de Cuentas">Analista de Cuentas</option>
            </select>
          </label>
          <button type="submit">Actualizar Rol</button>
        </form>
      </Modal>
    </div>
  );
}
