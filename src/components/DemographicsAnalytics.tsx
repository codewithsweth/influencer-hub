import { Users, Globe, Monitor, Clock } from 'lucide-react';
import { ChannelAnalytics } from '../types/influencer';

interface DemographicsAnalyticsProps {
  analytics?: ChannelAnalytics;
}

export function DemographicsAnalytics({ analytics }: DemographicsAnalyticsProps) {
  console.log('\n[DemographicsAnalytics] Rendering demographics');
  console.log('[DemographicsAnalytics] Analytics data:', analytics);

  const hasNoData = !analytics || (
    analytics.demographics.age.length === 0 &&
    analytics.demographics.gender.length === 0 &&
    analytics.geography.length === 0 &&
    analytics.deviceTypes.length === 0 &&
    analytics.totalWatchTime === 0 &&
    (!analytics.demographics.ageGenderBreakdown || analytics.demographics.ageGenderBreakdown.length === 0)
  );

  if (!analytics) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">Analytics data not available</p>
        <p className="text-sm text-gray-500 mt-2">Connect your channel to view detailed analytics</p>
      </div>
    );
  }

  if (hasNoData) {
    return (
      <div className="bg-yellow-50 rounded-xl shadow-sm border border-yellow-200 p-8 text-center">
        <Users className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics API Not Enabled</h3>
        <p className="text-gray-600 mb-4">
          YouTube Analytics API needs to be enabled in your Google Cloud project to view detailed audience demographics and watch time data.
        </p>
        <a
          href="https://console.developers.google.com/apis/api/youtubeanalytics.googleapis.com/overview?project=418254354787"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors"
        >
          Enable YouTube Analytics API
        </a>
        <p className="text-sm text-gray-500 mt-4">
          After enabling the API, disconnect and reconnect your channel to fetch analytics data.
        </p>
      </div>
    );
  }

  const formatWatchTime = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours.toLocaleString()}h`;
    }
    return `${minutes.toLocaleString()}m`;
  };

  const subscriberPercentage = analytics.totalWatchTime > 0
    ? Math.round((analytics.subscriberWatchTime / analytics.totalWatchTime) * 100)
    : 0;

  console.log('[DemographicsAnalytics] Calculated metrics:', {
    subscriberPercentage,
    totalWatchTime: formatWatchTime(analytics.totalWatchTime),
    subscriberWatchTime: formatWatchTime(analytics.subscriberWatchTime),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Audience Analytics</h2>
          <p className="text-gray-600">Lifetime data</p>
        </div>
      </div>

      {analytics.demographics.ageGenderBreakdown && analytics.demographics.ageGenderBreakdown.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl shadow-sm border border-blue-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Age & Gender Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-blue-300">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Age Group</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-blue-700">Male (%)</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-pink-700">Female (%)</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Total (%)</th>
                </tr>
              </thead>
              <tbody>
                {analytics.demographics.ageGenderBreakdown.map((row, index) => (
                  <tr
                    key={row.ageGroup}
                    className={`border-b border-blue-100 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}`}
                  >
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">{row.ageGroup}</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-blue-700">{row.male.toFixed(1)}</td>
                    <td className="py-3 px-4 text-sm text-right font-semibold text-pink-700">{row.female.toFixed(1)}</td>
                    <td className="py-3 px-4 text-sm text-right font-bold text-gray-900">{row.total.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Age Groups</h3>
          </div>
          {analytics.demographics.age.length > 0 ? (
            <div className="space-y-3">
              {analytics.demographics.age.map((item) => (
                <div key={item.ageGroup}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.ageGroup}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No age data available</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-pink-600" />
            <h3 className="text-lg font-semibold text-gray-900">Gender</h3>
          </div>
          {analytics.demographics.gender.length > 0 ? (
            <div className="space-y-3">
              {analytics.demographics.gender.map((item) => (
                <div key={item.gender}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.gender}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-pink-600 h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No gender data available</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Top Geographies</h3>
          </div>
          {analytics.geography.length > 0 ? (
            <div className="space-y-4">
              {analytics.geography.slice(0, 5).map((item) => (
                <div key={item.country} className="border-l-4 border-green-500 pl-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.country}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>{(item.views || 0).toLocaleString()} views</span>
                    <span>•</span>
                    <span>{(item.estimatedMinutesWatched || 0).toLocaleString()} min watched</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No geography data available</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Monitor className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Device Types</h3>
          </div>
          {analytics.deviceTypes.length > 0 ? (
            <div className="space-y-3">
              {analytics.deviceTypes.map((item) => (
                <div key={item.deviceType}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.deviceType}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No device data available</p>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-6 h-6 text-orange-600" />
          <h3 className="text-xl font-semibold text-gray-900">Watch Time</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Watch Time</p>
            <p className="text-3xl font-bold text-gray-900">{formatWatchTime(analytics.totalWatchTime)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Subscriber Watch Time</p>
            <p className="text-3xl font-bold text-orange-600">{formatWatchTime(analytics.subscriberWatchTime)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">From Subscribers</p>
            <p className="text-3xl font-bold text-orange-600">{subscriberPercentage}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
