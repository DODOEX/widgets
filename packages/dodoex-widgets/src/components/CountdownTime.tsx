import { useEffect, useState } from 'react';

export default function CountdownTime({
  endTime,
}: {
  endTime?: string | number;
}) {
  if (!endTime) return null;

  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const end =
        typeof endTime === 'string' ? new Date(endTime).getTime() : endTime;
      const dur = Math.max(0, end - now);

      let d = 0;
      let h = 0;
      let m = 0;
      let s = 0;
      if (dur > 0) {
        d = Math.floor(dur / oneDay);
        h = Math.floor((dur % oneDay) / oneHour);
        m = Math.floor(((dur % oneDay) % oneHour) / oneMinute);
        s = Math.floor((((dur % oneDay) % oneHour) % oneMinute) / oneSecond);
      }
      const dStr = d.toFixed(),
        hStr = h.toFixed().padStart(2, '0'),
        mStr = m.toFixed().padStart(2, '0'),
        sStr = s.toFixed().padStart(2, '0');

      if (d > 0) {
        setTimeLeft(`${dStr}d:${hStr}h:${mStr}m`);
      } else {
        setTimeLeft(`${hStr}h:${mStr}m:${sStr}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return <>{timeLeft}</>;
}

const oneSecond = 1 * 1000;
const oneMinute = oneSecond * 60;
const oneHour = oneMinute * 60;
const oneDay = oneHour * 24;
