// app/courses/[courseId]/page.js

const CoursePage = ({ params }) => {
    const { courseId } = params;
  
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Curso: {courseId}</h1>
        <p>¡Bienvenido al curso de {courseId}!</p>
      </div>
    );
  };
  
  export default CoursePage;
  