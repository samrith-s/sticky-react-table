import { sample, range, uniqueId } from 'lodash';

export function generateData(rows) {
  rows = parseInt(rows, 10);
  let data = [];
  while (rows--) {
    const name = sample([
      'John Doe',
      'Jane Doe',
      'Aaron Rickman',
      'Ramsay Bolton',
      'Weeknd',
      'Tywell Snow',
      'Salty Illaria'
    ]);

    const age = sample(range(21, 40));
    const gender = sample(['Male', 'Female', 'Other']);
    const designation = sample([
      'Business Developer',
      'Research Analyst',
      'Software Engineer',
      'UI Designer',
      'Marketing Associate',
      'Talent Aquisition'
    ]);
    const location = sample([
      'Mumbai',
      'London',
      'New York',
      'Chicago',
      'San Francisco',
      'Paris',
      'Berlin',
      'Barcelona'
    ]);
    const topSkill = sample([
      'Time Management',
      'Resource Management',
      'Brainstorming',
      'Analytical Thinking',
      'Perfectionist'
    ]);
    const email =
      name.toLowerCase().replace(/\s/, sample(['.', '_'])) +
      age +
      '@' +
      sample([
        'gmail.com',
        'yahoo.com',
        'hotmail.com',
        'aol.com',
        'outlook.com'
      ]);
    const phone =
      '+1 ' + sample([98765, 99101, 98914]) + ' ' + sample(range(10000, 98765));
    const experience = age - 21 + ' yrs';
    const language = sample([
      'English',
      'German',
      'French',
      'Spanish',
      'Italian',
      'Portuguese'
    ]);
    const maritalStatus = sample([
      'Married',
      'Unmarried',
      'Divorced',
      'Widowed'
    ]);
    const orientation = sample([
      'Heterosexual',
      'Transsexual',
      'Homosexual',
      'Sapiosexual',
      'Pansexual',
      'Meterosexual'
    ]);
    const theism = sample(['Atheist', 'Monotheist', 'Polytheist']);
    const religion =
      theism === 'Atheist'
        ? 'No Religion'
        : theism === 'Monotheist'
          ? sample(['Jainism', 'Jewism', 'Islam', 'Christianity', 'Buddhism'])
          : 'Hinduism';
    const id = uniqueId();

    data.push({
      id,
      name,
      age,
      gender,
      designation,
      location,
      topSkill,
      email,
      phone,
      experience,
      language,
      maritalStatus,
      orientation,
      theism,
      religion
    });
  }

  return data;
}
