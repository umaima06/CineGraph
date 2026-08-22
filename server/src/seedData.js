// Realistic, hand-curated seed data. Small enough to stay well inside the
// CognoDB free-tier (c0) limits, large enough to produce interesting,
// multi-hop recommendation and co-star paths.

export const movies = [
  { id: "m1", title: "Inception", year: 2010, genres: ["Sci-Fi", "Thriller"], director: "Christopher Nolan", actors: ["Leonardo DiCaprio", "Elliot Page", "Tom Hardy"] },
  { id: "m2", title: "Interstellar", year: 2014, genres: ["Sci-Fi", "Drama"], director: "Christopher Nolan", actors: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"] },
  { id: "m3", title: "The Dark Knight", year: 2008, genres: ["Action", "Crime"], director: "Christopher Nolan", actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"] },
  { id: "m4", title: "Dunkirk", year: 2017, genres: ["War", "Drama"], director: "Christopher Nolan", actors: ["Tom Hardy", "Fionn Whitehead", "Mark Rylance"] },
  { id: "m5", title: "The Revenant", year: 2015, genres: ["Adventure", "Drama"], director: "Alejandro González Iñárritu", actors: ["Leonardo DiCaprio", "Tom Hardy", "Will Poulter"] },
  { id: "m6", title: "The Wolf of Wall Street", year: 2013, genres: ["Comedy", "Crime"], director: "Martin Scorsese", actors: ["Leonardo DiCaprio", "Jonah Hill", "Margot Robbie"] },
  { id: "m7", title: "Shutter Island", year: 2010, genres: ["Mystery", "Thriller"], director: "Martin Scorsese", actors: ["Leonardo DiCaprio", "Mark Ruffalo", "Ben Kingsley"] },
  { id: "m8", title: "The Departed", year: 2006, genres: ["Crime", "Thriller"], director: "Martin Scorsese", actors: ["Leonardo DiCaprio", "Matt Damon", "Jack Nicholson"] },
  { id: "m9", title: "Goodfellas", year: 1990, genres: ["Crime", "Drama"], director: "Martin Scorsese", actors: ["Robert De Niro", "Ray Liotta", "Joe Pesci"] },
  { id: "m10", title: "Killers of the Flower Moon", year: 2023, genres: ["Crime", "Drama"], director: "Martin Scorsese", actors: ["Leonardo DiCaprio", "Robert De Niro", "Lily Gladstone"] },
  { id: "m11", title: "Mad Max: Fury Road", year: 2015, genres: ["Action", "Adventure"], director: "George Miller", actors: ["Tom Hardy", "Charlize Theron", "Nicholas Hoult"] },
  { id: "m12", title: "Venom", year: 2018, genres: ["Action", "Sci-Fi"], director: "Ruben Fleischer", actors: ["Tom Hardy", "Michelle Williams", "Riz Ahmed"] },
  { id: "m13", title: "Bullet Train", year: 2022, genres: ["Action", "Comedy"], director: "David Leitch", actors: ["Brad Pitt", "Joey King", "Aaron Taylor-Johnson"] },
  { id: "m14", title: "Once Upon a Time in Hollywood", year: 2019, genres: ["Comedy", "Drama"], director: "Quentin Tarantino", actors: ["Leonardo DiCaprio", "Brad Pitt", "Margot Robbie"] },
  { id: "m15", title: "Pulp Fiction", year: 1994, genres: ["Crime", "Drama"], director: "Quentin Tarantino", actors: ["John Travolta", "Samuel L. Jackson", "Uma Thurman"] },
  { id: "m16", title: "Django Unchained", year: 2012, genres: ["Western", "Drama"], director: "Quentin Tarantino", actors: ["Jamie Foxx", "Christoph Waltz", "Leonardo DiCaprio"] },
  { id: "m17", title: "Inglourious Basterds", year: 2009, genres: ["War", "Drama"], director: "Quentin Tarantino", actors: ["Brad Pitt", "Christoph Waltz", "Diane Kruger"] },
  { id: "m18", title: "Fight Club", year: 1999, genres: ["Drama", "Thriller"], director: "David Fincher", actors: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"] },
  { id: "m19", title: "Se7en", year: 1995, genres: ["Crime", "Mystery"], director: "David Fincher", actors: ["Brad Pitt", "Morgan Freeman", "Gwyneth Paltrow"] },
  { id: "m20", title: "The Social Network", year: 2010, genres: ["Drama", "Biography"], director: "David Fincher", actors: ["Jesse Eisenberg", "Andrew Garfield", "Armie Hammer"] },
  { id: "m21", title: "Gone Girl", year: 2014, genres: ["Mystery", "Thriller"], director: "David Fincher", actors: ["Ben Affleck", "Rosamund Pike", "Neil Patrick Harris"] },
  { id: "m22", title: "The Grand Budapest Hotel", year: 2014, genres: ["Comedy", "Adventure"], director: "Wes Anderson", actors: ["Ralph Fiennes", "Tony Revolori", "Saoirse Ronan"] },
  { id: "m23", title: "Moonrise Kingdom", year: 2012, genres: ["Comedy", "Romance"], director: "Wes Anderson", actors: ["Jared Gilman", "Kara Hayward", "Bill Murray"] },
  { id: "m24", title: "Parasite", year: 2019, genres: ["Drama", "Thriller"], director: "Bong Joon-ho", actors: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"] },
  { id: "m25", title: "Snowpiercer", year: 2013, genres: ["Sci-Fi", "Action"], director: "Bong Joon-ho", actors: ["Chris Evans", "Song Kang-ho", "Tilda Swinton"] },
  { id: "m26", title: "Oppenheimer", year: 2023, genres: ["Drama", "Biography"], director: "Christopher Nolan", actors: ["Cillian Murphy", "Emily Blunt", "Robert Downey Jr."] },
  { id: "m27", title: "Tenet", year: 2020, genres: ["Sci-Fi", "Action"], director: "Christopher Nolan", actors: ["John David Washington", "Robert Pattinson", "Elizabeth Debicki"] },
  { id: "m28", title: "La La Land", year: 2016, genres: ["Romance", "Musical"], director: "Damien Chazelle", actors: ["Ryan Gosling", "Emma Stone", "John Legend"] },
  { id: "m29", title: "Whiplash", year: 2014, genres: ["Drama", "Music"], director: "Damien Chazelle", actors: ["Miles Teller", "J.K. Simmons", "Melissa Benoist"] },
  { id: "m30", title: "Barbie", year: 2023, genres: ["Comedy", "Fantasy"], director: "Greta Gerwig", actors: ["Margot Robbie", "Ryan Gosling", "America Ferrera"] },
];

export const users = [
  { id: "u1", name: "Aisha" },
  { id: "u2", name: "Rohan" },
  { id: "u3", name: "Meera" },
  { id: "u4", name: "Karan" },
  { id: "u5", name: "Priya" },
];

// score is 1-5. This is deliberately overlapping so the collaborative-
// filtering traversal has real signal to work with.
export const ratings = [
  { user: "u1", movie: "m1", score: 5 },
  { user: "u1", movie: "m2", score: 5 },
  { user: "u1", movie: "m3", score: 4 },
  { user: "u1", movie: "m26", score: 5 },
  { user: "u1", movie: "m7", score: 4 },

  { user: "u2", movie: "m1", score: 4 },
  { user: "u2", movie: "m2", score: 4 },
  { user: "u2", movie: "m27", score: 5 },
  { user: "u2", movie: "m25", score: 4 },
  { user: "u2", movie: "m11", score: 5 },

  { user: "u3", movie: "m6", score: 5 },
  { user: "u3", movie: "m8", score: 5 },
  { user: "u3", movie: "m9", score: 4 },
  { user: "u3", movie: "m10", score: 5 },
  { user: "u3", movie: "m14", score: 4 },

  { user: "u4", movie: "m15", score: 5 },
  { user: "u4", movie: "m16", score: 5 },
  { user: "u4", movie: "m17", score: 4 },
  { user: "u4", movie: "m14", score: 5 },
  { user: "u4", movie: "m6", score: 4 },

  { user: "u5", movie: "m18", score: 5 },
  { user: "u5", movie: "m19", score: 4 },
  { user: "u5", movie: "m20", score: 5 },
  { user: "u5", movie: "m21", score: 4 },
  { user: "u5", movie: "m24", score: 5 },
];
