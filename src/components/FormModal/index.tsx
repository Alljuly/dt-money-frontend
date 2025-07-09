import { Input } from "../Form/Input";
import { TransactionSwitcher } from "../TransactionSwitcher";
import { ITransaction } from "@/types/transaction";
import { yupResolver } from "@hookform/resolvers/yup";
import { date, number, object, string, InferType } from "yup";
import { useForm } from "react-hook-form";
import React from "react";

// Validação do formulário
const transactionSchema = object({
  title: string()
    .required("O campo título é obrigatório")
    .min(5, "O título deve ter no mínimo 5 caracteres"),
  type: string()
    .oneOf(["INCOME", "OUTCOME"], 'O campo tipo deve ser "INCOME" ou "OUTCOME"')
    .required("O campo tipo é obrigatório"),
  price: number()
    .typeError("Preço deve ser um número")
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? undefined : Number(originalValue)
    )
    .positive("O preço deve ser maior que zero")
    .required("O campo preço é obrigatório"),
  category: string().required("O campo categoria é obrigatório"),
  data: date().default(() => new Date()),
});

type ITransactionType = InferType<typeof transactionSchema>;

// Valores padrão do formulário
const transactionDefaultValues: ITransactionType = {
  title: "",
  type: "INCOME",
  price: 0,
  category: "",
  data: new Date(),
};

export interface IFormModalProps {
  formTitle: string;
  closeModal: () => void;
  AddTransaction: (transaction: ITransaction) => void;
  initialData?: ITransaction;
}

export function FormModal({
  formTitle,
  closeModal,
  AddTransaction,
  initialData,
}: IFormModalProps) {
  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
    reset,
  } = useForm<ITransaction>({
    defaultValues: initialData || transactionDefaultValues,
    resolver: yupResolver(transactionSchema),
  });

  // Atualiza os valores do formulário quando initialData muda
  React.useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (formData: ITransaction) => {
    AddTransaction(formData);
    closeModal();
  };

  const handleChangeType = (type: "INCOME" | "OUTCOME") => {
    setValue("type", type);
  };

  const type = watch("type", "INCOME"); // valor padrão, se necessário

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500 opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-modal text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            {/* Botão de fechamento "X" */}
            <button
              type="button"
              className="absolute top-0 right-0 mt-4 mr-4 text-gray-400 hover:text-gray-600"
              onClick={closeModal}
              aria-label="Fechar"
            >
              <span className="text-2xl">&times;</span>
            </button>
            <div className="bg-modal px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h1
                    className="font-semibold leading-9 text-title text-2xl"
                    id="modal-title"
                  >
                    {formTitle}
                  </h1>
                </div>
              </div>
            </div>
            <form
              className="flex flex-col gap-4 px-12 mt-4 mb-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input type="text" placeholder="Título" {...register("title")} />
              {errors.title && (
                <span className="text-red-500 text-sm">
                  {errors.title?.message}
                </span>
              )}
              <Input type="number" placeholder="Preço" {...register("price")} />
              {errors.price && (
                <span className="text-red-500 text-sm">
                  {errors.price?.message}
                </span>
              )}
              <TransactionSwitcher setType={handleChangeType} type={type} />
              {errors.type && (
                <span className="text-red-500 text-sm">
                  {errors.type?.message}
                </span>
              )}
              <Input
                type="text"
                placeholder="Categoria"
                {...register("category")}
              />
              {errors.category && (
                <span className="text-red-500 text-sm">
                  {errors.category?.message}
                </span>
              )}
              <div className="bg-modal px-12 py-3 flex sm:flex-row-reverse w-full mb-11">
                <button
                  type="submit"
                  className="mt-3 w-full justify-center rounded-md bg-INCOME text-white px-3 py-5 text-normal font-semibold shadow-sm hover:opacity-80 sm:mt-0"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
