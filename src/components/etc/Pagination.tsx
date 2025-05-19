import styled from '@emotion/styled';
import { IoArrowForward,IoCaretForwardOutline } from "react-icons/io5";

interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  onPageChange,
  page,
  pageSize,
  total,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const startPage = Math.max(1, page - 6);
  const endPage = Math.min(totalPages, page + 6);
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => i + startPage,
  );
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return (
    <div className={className}>
      <OrderList>
        <FirstButton disabled={isFirstPage} onClick={() => onPageChange(1)}>
          <IoArrowForward width={16} height={16} />
        </FirstButton>
        <PrevButton
          disabled={isFirstPage}
          onClick={() => onPageChange(page - 1)}
        >
          <IoCaretForwardOutline width={16} height={16} />
        </PrevButton>
        {pages.map((p, i) => {
          return (
            <PageButton
              active={p === page}
              key={`index_${i}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </PageButton>
          );
        })}
        <NextButton
          disabled={isLastPage}
          onClick={() => onPageChange(page + 1)}
        >
          <IoCaretForwardOutline width={16} height={16} />
        </NextButton>
        <LastButton
          disabled={isLastPage}
          onClick={() => onPageChange(totalPages)}
        >
          <IoArrowForward width={16} height={16} />
        </LastButton>
      </OrderList>
    </div>
  );
}

const OrderList = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const PageButton = styled.button<{ active?: boolean }>`
  background-color: ${({ active }) => (active ? '#6C62D1' : 'white')};
  color: ${({ active }) => (active ? 'white' : '#999999')};
  min-width: 32px;
  min-height: 32px;
  border: ${({ active }) => (active ? 'none' : '1px solid #999999')};
  border-radius: 4px;
  cursor: pointer;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;

  &:focus {
    outline: none;
  }
  &:disabled {
    cursor: not-allowed;
    background: #f9f9f9;
    color: #ccc;
    border: none;
  }
`;

const PrevButton = styled(PageButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(180deg);
`;
const NextButton = styled(PageButton)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const FirstButton = styled(PageButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(180deg);
`;
const LastButton = styled(PageButton)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
