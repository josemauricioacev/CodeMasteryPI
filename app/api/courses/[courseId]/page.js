// app/courses/[courseId]/page.js

import React from 'react';

const CoursePage = ({ params }) => {
  const { courseId } = params;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Curso: {courseId.toUpperCase()}</h1>
      <p>Aquí irá el contenido dinámico de tu curso "{courseId}".</p>
    </div>
  );
};

export default CoursePage;
