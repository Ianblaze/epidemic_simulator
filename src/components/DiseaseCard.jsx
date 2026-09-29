import React from 'react';

export default function DiseaseCard({ disease, onSimulate }) {
  if (!disease) return null;

  return (
    <div className="disease-card">
      <div className="disease-card-header">
        <div className="disease-card-color-dot" style={{ color: disease.color || 'var(--red-accent)', background: disease.color || 'var(--red-accent)' }} />
        <h3 className="disease-card-name">{disease.name}</h3>
      </div>
      <p className="disease-card-description">{disease.description}</p>

      <div className="disease-stats-grid">
        <div className="disease-stat">
          <span className="disease-stat-label">R₀</span>
          <span className="disease-stat-value">{disease.r0}</span>
        </div>
        <div className="disease-stat">
          <span className="disease-stat-label">Incubation</span>
          <span className="disease-stat-value">{disease.incubationPeriod}d</span>
        </div>
        <div className="disease-stat">
          <span className="disease-stat-label">Infectious</span>
          <span className="disease-stat-value">{disease.infectiousPeriod}d</span>
        </div>
        <div className="disease-stat">
          <span className="disease-stat-label">CFR</span>
          <span className="disease-stat-value">{((disease.caseFatalityRate || 0) * 100).toFixed(1)}%</span>
        </div>
      </div>

      <button className="disease-simulate-btn" onClick={() => onSimulate(disease)}>
        Simulate Disease
      </button>
    </div>
  );
}
