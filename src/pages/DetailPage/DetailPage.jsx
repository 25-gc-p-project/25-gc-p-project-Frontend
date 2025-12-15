import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from 'components/Button';
import { useAuthStore } from 'stores/auth';
import { useCartStore } from 'stores/cart';
import { fetchProductDetail } from 'api/product';
import { addCartItem } from 'api/cart';
import {
  fetchProductReviews,
  fetchMyReviews,
  deleteReview,
  updateReview,
} from 'api/review';
import ReviewList from './ReviewList';

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuthStore();
  const { addItem } = useCartStore();

  const productId = Number(id);
  const sessionId = localStorage.getItem('sessionId') || undefined;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  const [myReviewIdSet, setMyReviewIdSet] = useState(new Set());

  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editScore, setEditScore] = useState(5);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const loadDetail = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await fetchProductDetail(productId, sessionId);

        const normalized = {
          ...data,
          image: data.imageUrl,
          benefits: data.healthBenefits ?? data.benefits ?? [],
        };

        setProduct(normalized);
      } catch (err) {
        console.error(err);
        setError('상품 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [productId, sessionId]);

  const reloadReviews = async () => {
    if (!productId) return;
    setReviewLoading(true);
    try {
      const data = await fetchProductReviews(productId);
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setReviews([]);
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    reloadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    if (!user) {
      setMyReviewIdSet(new Set());
      return;
    }

    const loadMine = async () => {
      try {
        const mine = await fetchMyReviews();
        const ids = new Set(
          (Array.isArray(mine) ? mine : [])
            .map((r) => r?.id)
            .filter((v) => typeof v === 'number' || typeof v === 'string')
        );
        setMyReviewIdSet(ids);
      } catch (e) {
        console.error(e);
        setMyReviewIdSet(new Set());
      }
    };

    loadMine();
  }, [user]);

  const redirectToLogin = () => {
    navigate('/login', { state: { from: location.pathname } });
  };

  const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleIncrease = () => setQuantity((prev) => prev + 1);

  const handleAddToCart = async () => {
    if (!user) return redirectToLogin();
    if (!product) return;

    try {
      await addCartItem({ productId, count: quantity });
      addItem(product, quantity);
    } catch (e) {
      console.error(e);
      alert('장바구니 담기에 실패했습니다.');
    }
  };

  const handleBuyNow = async () => {
    if (!user) return redirectToLogin();
    if (!product) return;

    try {
      await addCartItem({ productId, count: quantity });
      addItem(product, quantity);
      navigate('/cart');
    } catch (e) {
      console.error(e);
      alert('장바구니 담기에 실패했습니다.');
    }
  };

  const reviewCount = reviews.length;
  const avgScore =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + (Number(r.score) || 0), 0) /
        reviewCount
      : null;

  const avgRatingText =
    avgScore != null
      ? `${avgScore.toFixed(1)}점 (${reviewCount}개 리뷰)`
      : '아직 리뷰가 없습니다.';

  const startEdit = (r) => {
    setEditingId(r.id);
    setEditContent(r.content ?? '');
    setEditScore(Number(r.score) || 5);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
    setEditScore(5);
  };

  const handleSaveEdit = async (reviewId) => {
    if (!user) return redirectToLogin();
    if (!productId) return;

    setSaving(true);
    try {
      await updateReview(reviewId, {
        productId,
        content: editContent,
        score: Number(editScore),
      });

      cancelEdit();

      await Promise.all([
        reloadReviews(),
        (async () => {
          try {
            const mine = await fetchMyReviews();
            const ids = new Set(
              (Array.isArray(mine) ? mine : [])
                .map((r) => r?.id)
                .filter((v) => typeof v === 'number' || typeof v === 'string')
            );
            setMyReviewIdSet(ids);
          } catch (e) {
            console.error(e);
          }
        })(),
      ]);
    } catch (e) {
      console.error(e);
      alert('리뷰 수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!user) return redirectToLogin();

    const ok = window.confirm('리뷰를 삭제할까요?');
    if (!ok) return;

    setDeletingId(reviewId);
    try {
      await deleteReview(reviewId);

      if (editingId === reviewId) cancelEdit();

      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setMyReviewIdSet((prev) => {
        const next = new Set(prev);
        next.delete(reviewId);
        return next;
      });
    } catch (e) {
      console.error(e);
      alert('리뷰 삭제에 실패했습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-center text-gray-500">
          상품 정보를 불러오는 중입니다...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-center text-red-500">{error}</p>
        <div className="mt-4 flex justify-center">
          <Button variant="blue" mode="outlined" onClick={() => navigate(-1)}>
            이전 페이지로
          </Button>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-center text-gray-500">존재하지 않는 상품입니다.</p>
        <div className="mt-4 flex justify-center">
          <Button variant="blue" mode="outlined" onClick={() => navigate(-1)}>
            이전 페이지로
          </Button>
        </div>
      </main>
    );
  }

  const { name, imageUrl, price, benefits = [] } = product;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-500 hover:underline"
      >
        &lt; 목록으로 돌아가기
      </button>

      <section className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-1/2">
          <img
            src={imageUrl}
            alt={name}
            className="w-full rounded-xl object-cover md:h-[420px]"
          />
        </div>

        <div className="md:w-1/2 flex flex-col space-y-4">
          <h1 className="text-2xl font-bold">{name}</h1>

          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-yellow-400">★</span>
            <span>{avgRatingText}</span>
          </div>

          <div>
            <p>판매가</p>
            <div className="text-2xl font-semibold text-brandGreen">
              {price?.toLocaleString()}원
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-semibold">수량</p>
            <div className="flex items-center border rounded-lg max-w-28">
              <button
                onClick={handleDecrease}
                className="h-9 w-9"
                disabled={quantity === 1}
              >
                -
              </button>
              <div className="w-10 text-center">{quantity}</div>
              <button onClick={handleIncrease} className="h-9 w-9">
                +
              </button>
            </div>

            <div className="flex gap-2 h-12">
              <Button
                mode="outlined"
                className="flex-1"
                onClick={handleAddToCart}
              >
                장바구니 담기
              </Button>
              <Button
                variant="green"
                mode="filled"
                className="flex-1"
                onClick={handleBuyNow}
              >
                바로 구매
              </Button>
            </div>
          </div>
        </div>
      </section>

      {benefits.length > 0 && (
        <section className="mt-6 rounded-lg bg-gray-50 p-6">
          <h2 className="mb-3 text-lg font-semibold">어디에 좋은가요?</h2>
          <div className="flex flex-wrap gap-2">
            {benefits.map((b) => (
              <span
                key={b}
                className="px-4 py-2 bg-white text-brandGreen rounded-xl shadow-sm"
              >
                ✓ {b}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6 rounded-lg bg-gray-50 p-6 mb-12">
        <h2 className="mb-3 text-lg font-semibold">고객 리뷰</h2>

        <ReviewList
          reviews={reviews}
          loading={reviewLoading}
          myReviewIdSet={myReviewIdSet}
          editingId={editingId}
          editContent={editContent}
          editScore={editScore}
          saving={saving}
          deletingId={deletingId}
          onStartEdit={startEdit}
          onCancelEdit={cancelEdit}
          onChangeContent={setEditContent}
          onChangeScore={setEditScore}
          onSave={handleSaveEdit}
          onDelete={handleDelete}
        />
      </section>
    </main>
  );
}
