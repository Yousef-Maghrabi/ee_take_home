import st from '../theme';
import { Header, Body, Price } from './index';
import { Badge } from './index';
import { Image } from './index';

export interface SensorCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  discountBadge?: string;
  learnMoreUrl?: string;
  image: string;
  
  // State & Interactivity Handlers
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

export function SensorCard({
  title,
  description,
  price,
  compareAtPrice,
  discountBadge,
  learnMoreUrl = '#',
  image,
  quantity,
  onQuantityChange,
}: SensorCardProps) {
  const isSelected = quantity > 0;

  return (
    <div
      className={`
        ${st.components.card}
        ${isSelected ? st.components.cardSelected : st.components.cardUnselected}
        flex flex-col justify-between gap-4 h-full relative transition-all duration-200
      `}
    >
      {/* Top Section: Badge, Image & Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between min-h-[24px]">
          {discountBadge ? (
            <Badge text={discountBadge} />
          ) : compareAtPrice && compareAtPrice > price ? (
            <Badge price={price} compareAtPrice={compareAtPrice} />
          ) : (
            <div />
          )}
        </div>

        {/* Sensor Thumbnail */}
        <div className="w-full h-36 flex items-center justify-center p-2 bg-slate-50 rounded-lg">
          <Image
            src={image}
            alt={title}
            aspectRatio="square"
            objectFit="contain"
            className="h-full border-none bg-transparent p-0"
          />
        </div>

        {/* Details */}
        <div className="space-y-1">
          <Header as="h3" className="text-base font-semibold font-sans">
            {title}
          </Header>
          <Body className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">
            {description}
          </Body>
          {learnMoreUrl && (
            <a
              href={learnMoreUrl}
              className="inline-block text-xs font-semibold text-purple-600 hover:underline"
            >
              Learn More
            </a>
          )}
        </div>
      </div>

      {/* Bottom Section: Price & Quantity Stepper */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <Price amount={price} compareAtAmount={compareAtPrice} />

        {/* Quantity Stepper */}
        <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-white shadow-xs">
          <button
            type="button"
            disabled={quantity <= 0}
            onClick={() => onQuantityChange(quantity - 1)}
            className={st.components.stepperBtn}
            aria-label={`Decrease quantity of ${title}`}
          >
            -
          </button>
          <span className="w-6 text-center text-xs font-semibold text-slate-800">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => onQuantityChange(quantity + 1)}
            className={st.components.stepperBtn}
            aria-label={`Increase quantity of ${title}`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default SensorCard;