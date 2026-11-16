import React, { useState } from 'react';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockRecs = [
      "Based on popular items: Try our Chef's Special Pasta",
      "Vegetarian recommendation: Mediterranean Salad with fresh ingredients",
      "Today's special: Grilled Salmon with seasonal vegetables"
    ];
    
    setRecommendations(mockRecs);
    setIsLoading(false);
  };

  return (
    <div className="recommendations-section">
      <h4>Personalized Recommendations</h4>
      <button 
        onClick={handleGetRecommendations} 
        className="btn btn-secondary"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Get Recommendations'}
      </button>
      
      {recommendations.length > 0 && (
        <div className="recommendations-list">
          {recommendations.map((rec, index) => (
            <div key={index} className="recommendation-item">
              {rec}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;