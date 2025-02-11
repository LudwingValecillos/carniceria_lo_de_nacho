import React, { useState, useEffect } from 'react';

interface AnalyticsResponse {
  results: {
    pageviews: number;
  };
}

const AnalyticsWidget: React.FC = () => {
  const [pageViews, setPageViews] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async (): Promise<void> => {
      try {
        const response = await fetch(
          'https://plausible.io/api/v1/stats/aggregate?site_id=lodenachocarniceria.com&metrics=pageviews',
          {
            headers: {
              'Authorization': 'Bearer v3p-8WY0jhic7VEZmSKPzBzh18398QrZP0VYEo9ibWWLxq6bhHfU7fyZsD2tvXyE'
            }
          }
        );
    
        if (!response.ok) {
          throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
        }
    
        const data: AnalyticsResponse = await response.json();
        console.log(data);
        
        setPageViews(data.results.pageviews.value);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setPageViews(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="p-4 border rounded bg-gray-50 mb-6">
      <h2 className="text-xl font-bold mb-2">Estadísticas de Visitas</h2>
      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <p>Total de vistas: {pageViews !== null ? pageViews : 'No disponible'}</p>
      )}
    </div>
  );
};

export default AnalyticsWidget;
