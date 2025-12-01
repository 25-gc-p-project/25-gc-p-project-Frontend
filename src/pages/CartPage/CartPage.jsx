import Button from "components/Button";
import { useCartStore } from "stores/cart";

export default function CartPage() {
  const {
    items,
    toggleItem,
    toggleAll,
    updateQuantity,
    removeItem,
    removeSelected,
    getSummary,
  } = useCartStore();

  const summary = getSummary();
  const allChecked = items.length > 0 && items.every((item) => item.checked);

  const hasSelected = summary.selectedCount > 0;

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-4 text-2xl font-bold">장바구니</h1>
        <div className="rounded-lg py-16 text-center bg-gray-50">
          장바구니에 담긴 상품이 없습니다.
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-4 text-2xl font-bold">장바구니</h1>

        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <section className="flex-1">
            <div className="mb-10 flex items-center justify-between border-b p-4 rounded-lg bg-white shadow-sm border border-gray-200">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={(e) => toggleAll(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>
                  전체 선택 ({summary.selectedCount}/{summary.totalCount})
                </span>
              </label>

              <button
                type="button"
                className="text-brandDanger disabled:text-gray-300"
                disabled={!hasSelected}
                onClick={removeSelected}
              >
                선택 삭제
              </button>
            </div>

            <ul className="divide-y">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="mb-5 flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center rounded-lg bg-white shadow-sm border border-gray-200"
                >
                  <div className="flex items-start gap-3 md:w-2/3">
                    <input
                      type="checkbox"
                      className="mt-2 w-4 h-4"
                      checked={item.checked}
                      onChange={() => toggleItem(item.productId)}
                    />

                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-20 rounded-md object-cover"
                    />

                    <div className="flex-1 text-lg text-gray-800">
                      <p className="font-medium">{item.name}</p>
                      {item.weight && (
                        <p className="mt-1 text-sm text-gray-500">
                          {item.weight}
                        </p>
                      )}

                      <div className="mt-3 flex items-center gap-3">
                        <span className="text-sm text-gray-500">수량</span>
                        <div className="flex items-center rounded-lg border border-gray-300">
                          <button
                            type="button"
                            className="h-7 w-7 text-sm"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            disabled={item.quantity === 1}
                          >
                            -
                          </button>
                          <div className="w-8 text-center text-sm">
                            {item.quantity}
                          </div>
                          <button
                            type="button"
                            className="h-7 w-7 text-sm"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 items-center justify-between md:flex-col md:items-end md:gap-3">
                    <button
                      type="button"
                      className="text-sm text-gray-400 hover:text-gray-600 md:self-end"
                      onClick={() => removeItem(item.productId)}
                    >
                      ✕
                    </button>
                    <div className="flex flex-col gap-1">
                      <p className="text-lg font-semibold text-brandGreen">
                        {(item.price * item.quantity).toLocaleString()}원
                      </p>
                      <p className="text-sm text-gray-400">
                        개당 {item.price.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <aside className="w-full max-w-xs rounded-lg bg-white p-5 shadow-sm border border-gray-200 md:w-80">
            <h2 className="mb-4 text-xl font-semibold">주문 요약</h2>

            <div className="space-y-2 text-md">
              <div className="flex justify-between">
                <span className="text-base">상품 금액</span>
                <span>{summary.productAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span>배송비</span>
                <span>
                  {summary.shippingFee === 0
                    ? "무료"
                    : `${summary.shippingFee.toLocaleString()}원`}
                </span>
              </div>
            </div>

            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>총 결제 금액</span>
                <span className="text-brandBlue">
                  {summary.totalAmount.toLocaleString()}원
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="blue"
              height={50}
              className="mt-5 w-full py-3 text-sm font-semibold"
              disabled={!hasSelected}
            >
              결제하기
            </Button>

            <div className="mt-4 rounded-lg bg-gray-50 p-5 text-sm text-gray-500">
              <p className="text-black text-xl mb-4">안내사항</p>
              <div>
                <p>50,000원 이상 구매 시 무료배송</p>
                <p className="mt-1">영업일 기준 2~3일 내 배송</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
