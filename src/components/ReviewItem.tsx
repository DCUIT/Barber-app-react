import { View, Text, memo } from 'react-native';
import Avatar from './ui/Avatar';
import { formatDateTime } from '../utils/format';
import type { Review } from '../types/models';

interface ReviewItemProps { review: Review }

const ReviewItem = memo(function ReviewItem({ review }: ReviewItemProps) {
  return (
    <View className="bg-[#16213e] rounded-xl p-4 mb-3 border border-gray-700">
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Avatar name={review.userId?.name} size={32} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text className="text-white font-bold text-sm">{review.userId?.name || 'Anonymous'}</Text>
          <Text className="text-gray-500 text-xs">{formatDateTime(review.createdAt)}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {[1, 2, 3, 4, 5].map(star => (
            <Text key={star} style={{ color: star <= review.rating ? '#c5a059' : '#4b5563' }}>★</Text>
          ))}
        </View>
      </View>
      {review.comment ? <Text className="text-gray-300 text-sm mt-1">{review.comment}</Text> : null}
    </View>
  );
});

export default ReviewItem;
