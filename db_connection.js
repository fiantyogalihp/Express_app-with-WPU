/* eslint-disable no-console */
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient('mongodb://127.0.0.1:27017');

const main = async () => {
  try {
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db('fiyuu');
    const mahasiswa = db.collection('mahasiswa');

    // * create 1 data
    const insertOne = await mahasiswa.insertOne(
      {
        name: "bagas",
        nohp: "0832342384293",
        email: "bagassatrio@gmail.com"
      }
    )
    console.log(insertOne);

    // * create many data
    const insertMany = await mahasiswa.insertMany(
      [
        {
          name: "bagas",
          nohp: "0832348293",
          email: "bagas@gmail.com"
        },
        {
          name: "budi",
          nohp: "08323492383",
          email: "budi@gmail.com"
        }
      ])
    console.log(insertMany);

    // * read all data
    const read = await mahasiswa.find().toArray();
    console.log(read);

    // * read spesific data
    const spesificRead = await mahasiswa.find({
      name: 'bagas'
    }).toArray();
    console.log(spesificRead);

    // * update 1 data
    const updateOne = await mahasiswa.updateOne({
      name: 'budi'
    },
      {
        $set: {
          email: 'abdulbudi@yahoo.com',
        }
      }
    );
    console.log(updateOne);

    // * update many data
    const updateMany = await mahasiswa.updateMany({
      name: 'bagas'
    },
      {
        $set: {
          email: 'bagassatrio@sch.co.id',
        }
      }
    );
    console.log(updateMany);

    // * delete 1 data
    const deleteOne = await mahasiswa.deleteOne({
      name: 'budi'
    });
    console.log(deleteOne);

    // * delete many data
    const deleteMany = await mahasiswa.deleteMany({
      name: 'bagas'
    });
    console.log(deleteMany);

    // ? check db
    const check = await mahasiswa.find().toArray();
    console.log(check);

    return 'done.';
  } catch (error) {
    if (error instanceof MongoServerError) {
      console.log(`Error worth logging: ${error}`); // special case for some reason
    }
    throw error;
  } finally {
    await client.close();
  }
}

main().catch(console.dir);
