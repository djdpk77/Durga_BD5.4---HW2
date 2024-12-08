let express = require('express');
let app = express();

let resolve = require('path');
let { sequelize } = require('./lib/index');

let { student } = require('./models/student.model');
let { course } = require('./models/course.model');

app.use(express.json());

let studentData = [{ name: 'John Doe', age: 24 }];

let courseData = [
  { title: 'Math 101', description: 'Basic Mathematics' },
  { title: 'History 201', description: 'World History' },
  { title: 'Science 301', description: 'Basic Sciences' },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    await student.bulkCreate(studentData);

    await course.bulkCreate(courseData);

    res.status(200).json({ message: 'Database seeding successfull' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error seeding the data', error: error.message });
  }
});

async function fetchAllStudents() {
  let students = await student.findAll();
  return { students };
}

app.get('/students', async (req, res) => {
  try {
    let students = await fetchAllStudents();

    res.status(200).json(students);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching the data', error: error.message });
  }
});

async function fetchAllCourses() {
  let courses = await course.findAll();
  return { courses };
}

app.get('/courses', async (req, res) => {
  try {
    let courses = await fetchAllCourses();

    res.status(200).json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching the data', error: error.message });
  }
});

//Function to add new student
async function addNewStudent(newStudent) {
  let response = await student.create(newStudent);

  return { response };
}

//Endpoint 1: Create New Student
app.post('/students/new', async (req, res) => {
  try {
    let newStudent = req.body.newStudent;
    let response = await addNewStudent(newStudent);

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error creating the data', error: error.message });
  }
});

//Function to update student by id
async function updateStudentById(id, updatedStudentData) {
  let studentDetails = await student.findOne({ where: { id } });
  if (!studentDetails) {
    return {};
  }

  studentDetails.set(updatedStudentData);
  let updatedStudent = await studentDetails.save();

  return { message: 'Student updated successfully', updatedStudent };
}

//Endpoint 2: Update Student by ID
app.post('/students/update/:id', async (req, res) => {
  try {
    let updatedStudentData = req.body;
    let id = parseInt(req.params.id);

    let response = await updateStudentById(id, updatedStudentData);

    if (!response.message) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating the data', error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
