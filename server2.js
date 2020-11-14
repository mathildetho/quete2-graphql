const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const port = 5000;

// GraphQL schema
const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
        filterTitleCourses(title_contains: String): [Course!]!
    },
    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
        addCourse(input: AddCourseInput):[Course]
    }
    input AddCourseInput {
        title: String!
        author: String!
        description: String!
        topic: String!
        url: String!
    }
    type Course {
        id: Int!
        title: String!
        author: String!
        description: String!
        topic: String!
        url: String!
    }
`);

const coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]

const getCourse = function(args) { 
    const id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}

const getCourses = function(args) {
    if (args.topic) {
        const topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

const getFilteredTitleCourses = function({title_contains}) {
    return coursesData.filter(course => course.title.includes(title_contains));
}

const updateCourseTopic = function({id, topic}) {
    coursesData.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    });
    return coursesData.filter(course => course.id === id) [0];
}

const addCourse = function({input}) {
    const newCourse = {
        id: coursesData.length,
        title: input.title,
        author: input.author,
        description: input.description,
        topic: input.topic,
        url: input.url
    };
    coursesData.push(newCourse);
    return coursesData;
}


const root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic,
    filterTitleCourses: getFilteredTitleCourses,
    addCourse: addCourse
};

// Create an express server and a GraphQL endpoint
const app = express();
app.use('/graphql', graphqlHTTP ({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(port, () => console.log('Express GraphQL Server Now Running'));