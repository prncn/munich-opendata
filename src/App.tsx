import axios from 'axios';
import { useEffect, useState } from 'react';
import { CiLocationOn } from 'react-icons/ci';
import { CgSpinner } from 'react-icons/cg';
import {
  corsPrefixer,
  getDistanceFromCentral,
  getFirstImageFromPage,
} from './Services';

interface Record {
  _id: number;
  name: string;
  bayernCloudType: string;
  description: string;
  'geo/latitude': number;
  'geo/longitude': number;
  url: string;
  img: string;
}

export default function App() {
  const [records, setRecords] = useState<Record[]>([]);
  const [recordsLoaded, setRecordsLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const munichApi =
    'https://opendata.muenchen.de/api/3/action/datastore_search?resource_id=b6b45b42-2e6c-43af-898f-c5cfa1d660b8&limit=20';

  useEffect(() => {
    (async () => {
      const response = await axios.get(corsPrefixer + munichApi);
      const data = response.data['result']['records'];

      if (response.status == 200) {
        setRecords(data);
        setRecordsLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setRecords(
        await Promise.all(
          records.map(async (record) => {
            const image = await getFirstImageFromPage(record.url);
            if (image !== '') {
              setImagesLoaded(true);
              return { ...record, img: image };
            } else {
              console.log(record.bayernCloudType);

              if (record.bayernCloudType === null) {
                record.bayernCloudType = 'Natur'
              }
              return {
                ...record,
                img: `${record.bayernCloudType.toLowerCase()}.png`,
              };
            }
          })
        )
      );
    })();
  }, [recordsLoaded]);

  return (
    <section className="min-h-screen flex justify-center items-center bg-slate-50">
      <div className="flex flex-col py-32">
        <p className="font-semibold text-4xl">munich opendata</p>
        <p className="text-sm">Explore what the city has to offer</p>
        <div className="pt-16 grid-cols-2 grid gap-8">
          {records.map((record) => {
            return (
              <div
                key={record._id}
                className="rounded-lg bg-white flex flex-row shadow-xl shadow-slate-100 h-64 relative"
                style={{
                  width: '48rem',
                }}
              >
                <a href={record.url} className='hover:opacity-100 opacity-0 transition rounded-lg absolute h-full w-full top-0 left-0 bg-black/60 text-white flex justify-center items-center text-xl font-semibold'>
                  Visit {record.name} homepage
                </a>
                <div className="min-w-64 flex p-12">
                  <div
                    className="rounded-xl w-full h-full overflow-clip bg-orange-200 flex justify-center items-center"
                    style={{
                      background:
                        'linear-gradient(330deg, rgba(223,218,221,1) 0%, rgba(202,222,230,1) 100%)',
                    }}
                  >
                    {!imagesLoaded ? (
                      <CgSpinner size={48} className="animate-spin" />
                    ) : (
                      <img
                        src={record.img}
                        alt="tourist"
                        className="w-full h-full"
                        style={{
                          objectFit: 'cover',
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-semibold uppercase text-black/50">
                    {record.bayernCloudType}
                  </p>
                  <p className="text-3xl font-semibold py-4">{record.name}</p>
                  <p className="pb-4 text-sm">{record.description}</p>
                  <div className="flex flex-row space-x-2 items-center text-black/80">
                    <CiLocationOn color="black" size={42} />
                    <p>
                      {getDistanceFromCentral(
                        record['geo/latitude'],
                        record['geo/longitude']
                      )}
                      km away from Central Station
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div></div>
      </div>
    </section>
  );
}
