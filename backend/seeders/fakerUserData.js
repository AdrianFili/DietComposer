const { faker } = require('@faker-js/faker');

const dietData = {min: 0, max: 0};
const dietPurpose = ['spadek wagi','utrzymanie wagi','przyrost wagi','-'];
const physicalActivity =  ['brak ćwiczeń','znikoma','mała','umiarkowana','duża','bardzo duża','-'];

const User = () => {
  const user = {
    id: faker.datatype.uuid(),
    userImage: faker.internet.avatar(),
    userName: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    age: faker.datatype.number({min:1, max:99}),
    gender: faker.helpers.arrayElement(['Kobieta', 'Mężczyzna']),
    weight: faker.datatype.number(dietData),
    height: faker.datatype.number(dietData),
    dietPurpose: faker.helpers.arrayElement(dietPurpose),
    physicalActivity: faker.helpers.arrayElement(physicalActivity),
    BMI: faker.datatype.number(dietData),
    caloricDemand: faker.datatype.number(dietData),
    proteinsDemand: faker.datatype.number(dietData),
    fatsDemand: faker.datatype.number(dietData),
    carbohydratesDemand: faker.datatype.number(dietData),
  };
  return user;
};
module.exports = { User };



