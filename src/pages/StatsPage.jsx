import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useProgress } from '../hooks/useProgress';
import { isDue } from '../utils/srs';

const STATUS_COLORS = {
  New:       '#7c82a0',
  Learning:  '#facc15',
  Reviewing: '#60a5fa',
  Mastered:  '#fbbf24',
};

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function daysAgoStr(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function computeStreak(studyDates) {
  if (studyDates.size === 0) return 0;
  let streak = 0;
  const d = new Date();
  // Start from today; if not studied today, start from yesterday
  if (!studyDates.has(d.toISOString().split('T')[0])) {
    d.setDate(d.getDate() - 1);
  }
  while (studyDates.has(d.toISOString().split('T')[0])) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export default function StatsPage({ words }) {
  const { progress, stats, getCard } = useProgress();

  const totalWords = words.length;
  const allCards = Object.values(progress);
  const newCount = Math.max(0, totalWords - allCards.length);

  const studyDates = useMemo(
    () => new Set(allCards.map((c) => c.lastSeen).filter(Boolean)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [progress]
  );

  const streak = computeStreak(studyDates);

  const dueTodayCount = useMemo(
    () => words.filter((w) => { const c = getCard(w.id); return c.lastSeen && isDue(c); }).length,
    [words, getCard]
  );

  // Pie / donut data
  const pieData = [
    { name: 'New',       value: newCount,         color: STATUS_COLORS.New },
    { name: 'Learning',  value: stats.learning,   color: STATUS_COLORS.Learning },
    { name: 'Reviewing', value: stats.reviewing,  color: STATUS_COLORS.Reviewing },
    { name: 'Mastered',  value: stats.mastered,   color: STATUS_COLORS.Mastered },
  ].filter((d) => d.value > 0);

  // Overall accuracy
  const totalCorrect  = allCards.reduce((s, c) => s + (c.timesCorrect   ?? 0), 0);
  const totalAnswered = allCards.reduce((s, c) => s + (c.timesCorrect   ?? 0) + (c.timesIncorrect ?? 0), 0);
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : null;

  // Last-7-day accuracy (cards last seen in last 7 days — approximation)
  const sevenDaysAgo = daysAgoStr(6);
  const recentCards    = allCards.filter((c) => c.lastSeen && c.lastSeen >= sevenDaysAgo);
  const recentCorrect  = recentCards.reduce((s, c) => s + (c.timesCorrect   ?? 0), 0);
  const recentAnswered = recentCards.reduce((s, c) => s + (c.timesCorrect   ?? 0) + (c.timesIncorrect ?? 0), 0);
  const recentAccuracy = recentAnswered > 0 ? Math.round((recentCorrect / recentAnswered) * 100) : null;

  // 14-day bar chart
  const barData = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const day = daysAgoStr(13 - i);
      const count = allCards.filter((c) => c.lastSeen === day).length;
      return { date: day.slice(5), count }; // "MM-DD"
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  // Estimated completion
  const wordsToMaster = totalWords - stats.mastered;
  const studied14 = allCards.filter((c) => c.lastSeen && c.lastSeen >= daysAgoStr(13)).length;
  const avgPerDay = studied14 / 14;
  let estimatedDate = null;
  if (avgPerDay > 0 && wordsToMaster > 0) {
    const daysLeft = Math.ceil(wordsToMaster / avgPerDay);
    const d = new Date();
    d.setDate(d.getDate() + daysLeft);
    estimatedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <div className="page page-stats">
      <h1 className="page-title">Progress</h1>

      {/* Streak + Due today */}
      <div className="stats-grid stats-top-row">
        <div className="stat-card stat-card--flame">
          <span className="stat-icon">🔥</span>
          <span className="stat-value">{streak}</span>
          <span className="stat-label">Day Streak</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📚</span>
          <span className="stat-value">{dueTodayCount}</span>
          <span className="stat-label">Due Today</span>
        </div>
      </div>

      {/* Status donut */}
      <div className="stats-section">
        <h2 className="section-title">Word Status</h2>
        {pieData.length > 0 ? (
          <div className="stats-donut-wrap">
            <PieChart width={160} height={160}>
              <Pie
                data={pieData}
                cx={75}
                cy={75}
                innerRadius={44}
                outerRadius={72}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v) => [`${v} words`, '']}
                contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'var(--text-muted)' }}
              />
            </PieChart>
            <div className="stats-donut-legend">
              {[
                { name: 'New',       value: newCount,        color: STATUS_COLORS.New },
                { name: 'Learning',  value: stats.learning,  color: STATUS_COLORS.Learning },
                { name: 'Reviewing', value: stats.reviewing, color: STATUS_COLORS.Reviewing },
                { name: 'Mastered',  value: stats.mastered,  color: STATUS_COLORS.Mastered },
              ].map(({ name, value, color }) => (
                <div key={name} className="donut-legend-item">
                  <span className="donut-legend-dot" style={{ background: color }} />
                  <span className="donut-legend-label">{name}</span>
                  <span className="donut-legend-count">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="stats-empty">Start studying to see your word breakdown.</p>
        )}
      </div>

      {/* Accuracy */}
      <div className="stats-grid stats-accuracy-row">
        <div className="stat-card">
          <span className="stat-value">{overallAccuracy !== null ? `${overallAccuracy}%` : '—'}</span>
          <span className="stat-label">Overall Accuracy</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{recentAccuracy !== null ? `${recentAccuracy}%` : '—'}</span>
          <span className="stat-label">Last 7 Days</span>
        </div>
      </div>

      {/* 14-day bar chart */}
      <div className="stats-section">
        <h2 className="section-title">Last 14 Days</h2>
        <div className="stats-bar-wrap">
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={barData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
                tickLine={false}
                axisLine={false}
                interval={1}
              />
              <YAxis
                tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'var(--text-muted)' }}
                itemStyle={{ color: 'var(--text)' }}
                formatter={(v) => [`${v} cards`, '']}
                cursor={{ fill: 'var(--bg-elevated)' }}
              />
              <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Estimated completion */}
      {estimatedDate ? (
        <div className="stats-completion">
          <span className="stats-completion-label">Estimated mastery</span>
          <span className="stats-completion-date">{estimatedDate}</span>
        </div>
      ) : wordsToMaster > 0 ? (
        <div className="stats-completion">
          <span className="stats-completion-label">Estimated mastery</span>
          <span className="stats-completion-date stats-completion-na">Study more to estimate</span>
        </div>
      ) : (
        <div className="stats-completion stats-completion--done">
          <span>🎓 All words mastered!</span>
        </div>
      )}
    </div>
  );
}
