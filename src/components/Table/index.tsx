import { ITransaction } from "@/types/transaction";
import { formatCurrency, formatDate } from "@/utils";

export interface ITableProps {
  data: ITransaction[];
  onDelete?: (id: string) => void;
  onEdit?: (transaction: ITransaction) => void;
}

export function Table({ data, onDelete, onEdit }: ITableProps) {
  return (
    <>
      <table className="w-full mt-16 border-0 border-separate border-spacing-y-2 ">
        <thead>
          <tr>
            <th className="px-4 text-left text-table-header text-base font-medium">
              Título
            </th>
            <th className="px-4 text-left text-table-header text-base font-medium">
              Preço
            </th>
            <th className="px-4 text-left text-table-header text-base font-medium">
              Categoria
            </th>
            <th className="px-4 text-left text-table-header text-base font-medium">
              Data
            </th>
            <th className="px-4 text-left text-table-header text-base font-medium">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="bg-white h-16 rounded-lg">
              <td className="px-4 py-4 whitespace-nowrap text-title">
                {item.title}
              </td>
              <td
                className={`px-4 py-4 whitespace-nowrap text-right ${
                  item.type === "INCOME" ? "text-INCOME" : "text-OUTCOME"
                }`}
              >
                {formatCurrency(item.price)}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-table">
                {item.category}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-table">
                {item.data ? formatDate(new Date(item.data)) : ""}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-table flex gap-2">
                {onEdit && (
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => onEdit(item)}
                  >
                    Editar
                  </button>
                )}
                {onDelete && item.id && (
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => onDelete(item.id!)}
                  >
                    Excluir
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
