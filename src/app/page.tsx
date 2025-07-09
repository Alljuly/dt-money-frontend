"use client";
import { BodyContainer } from "@/components/BodyContainer";
import { CardContainer } from "@/components/CardContainer";
import { FormModal } from "@/components/FormModal";
import { Header } from "@/components/Header";
import { Table } from "@/components/Table";
import { ITotal, ITransaction } from "@/types/transaction";
import { useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const {
    data: transactions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["transactions", page],
    queryFn: async () => {
      const skip = (page - 1) * pageSize;
      const take = pageSize;
      const response = await axios.get(
        `http://localhost:5000/transaction?skip=${skip}&take=${take}`
      );
      return response.data;
    },
  });

  const { data: allTransactions = [] } = useQuery({
    queryKey: ["all-transactions"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:5000/transaction?skip=0&take=1000`
      );
      return response.data;
    },
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editTransaction, setEditTransaction] = useState<ITransaction | null>(
    null
  );

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`http://localhost:5000/transaction/${id}`);
    },
    onSuccess: () => {
      refetch();
      toast.success("Transação excluída com sucesso!");
      setShowDeleteModal(false);
      setDeleteId(null);
    },
    onError: () => {
      toast.error("Erro ao excluir transação.");
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newTransaction: ITransaction) => {
      await axios.post("http://localhost:5000/transaction", newTransaction);
    },
    onSuccess: () => {
      refetch();
      toast.success("Transação criada com sucesso!");
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("Erro ao criar transação.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updated: ITransaction) => {
      if (!updated.id) throw new Error("ID não informado");
      await axios.patch(
        `http://localhost:5000/transaction/${updated.id}`,
        updated
      );
    },
    onSuccess: () => {
      refetch();
      toast.success("Transação atualizada com sucesso!");
      setEditTransaction(null);
    },
    onError: () => {
      toast.error("Erro ao atualizar transação.");
    },
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleAddTransaction = (newTransaction: ITransaction) => {
    createMutation.mutate({
      ...newTransaction,
      type: newTransaction.type,
    });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleEdit = (transaction: ITransaction) => {
    setEditTransaction(transaction);
  };

  const handleUpdateTransaction = (updated: ITransaction) => {
    updateMutation.mutate({
      ...updated,
      type: updated.type,
    });
  };

  const totalTransactions: ITotal = useMemo(() => {
    if (!allTransactions || allTransactions.length === 0) {
      return { totalIncome: 0, totalOutcome: 0, total: 0 };
    }

    return allTransactions.reduce(
      (acc: ITotal, { type, price }: ITransaction) => {
        if (type === "INCOME") {
          acc.totalIncome += price;
          acc.total += price;
        } else if (type === "OUTCOME") {
          acc.totalOutcome += price;
          acc.total -= price;
        }
        return acc;
      },
      { totalIncome: 0, totalOutcome: 0, total: 0 }
    );
  }, [allTransactions]);

  return (
    <div>
      <ToastContainer />
      <Header handleNewTransaction={handleOpenModal} />
      <BodyContainer>
        <CardContainer totals={totalTransactions} />
        {isLoading ? (
          <div>Carregando...</div>
        ) : error ? (
          <div>Erro ao carregar transações</div>
        ) : (
          <Table
            data={transactions ?? []}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Anterior
          </button>
          <span>Página {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Próxima
          </button>
        </div>
        {isModalOpen && (
          <FormModal
            closeModal={handleCloseModal}
            formTitle="Adicionar Transação"
            AddTransaction={handleAddTransaction}
          />
        )}
        {editTransaction && (
          <FormModal
            closeModal={() => setEditTransaction(null)}
            formTitle="Editar Transação"
            AddTransaction={handleUpdateTransaction}
            initialData={editTransaction}
          />
        )}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Confirmar Exclusão</h2>
              <p className="mb-6">
                Tem certeza que deseja excluir esta transação?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </BodyContainer>
    </div>
  );
}
