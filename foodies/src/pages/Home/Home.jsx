import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { getRecommendations } from '../../service/recommendationService';

const Home = () => {

  const [category, setCategory] = useState('All');
  const [recommendations, setRecommendations] = useState([]);

  const { token } = useContext(StoreContext);

  useEffect(() => {

    const loadRecommendations = async () => {

      if (!token) return;

      try {

        const data = await getRecommendations(token);

        setRecommendations(data.recommendations || []);

      } catch (error) {

        console.error(error);

      }
    };

    loadRecommendations();

  }, [token]);

  return (
    <main className='container'>

      <Header />

      <ExploreMenu
        category={category}
        setCategory={setCategory}
      />

      {recommendations.length > 0 && (
        <div className="mt-5">

          <h3>You May Also Like</h3>

          <ul>
            {recommendations.map((food, index) => (
              <li key={index}>{food}</li>
            ))}
          </ul>

        </div>
      )}

      <FoodDisplay
        category={category}
        searchText={''}
      />

    </main>
  )
}

export default Home;