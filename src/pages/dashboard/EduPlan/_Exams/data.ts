interface IExamsData {
  id: number;
  subject: {
    name: string;
    lessonType: string;
  };
  employee: string;
  exam_score: {
    max_score: number;
    score: number;
  };
  deadline: {
    start_date: number;
    end_date: number;
  };
  date: number;
  numberOfQuestions: number;
  duration: number;
  max_attempts: number;
}

const staticExamsData: IExamsData[] = [];

for (let i = 0; i < 3; i += 1) {
  staticExamsData.push({
    id: i,
    subject: {
      name: "O'zbekistonning eng yangi tarixi",
      lessonType: 'Yakuniy nazorat ',
    },
    employee: 'MAMAJONOV J. I',
    exam_score: {
      max_score: 50,
      score: 20,
    },
    deadline: {
      start_date: 1679634000,
      end_date: 1707764100,
    },
    date: 1679634480,
    numberOfQuestions: 25,
    duration: 60,
    max_attempts: 1,
  });
}

export default staticExamsData;
