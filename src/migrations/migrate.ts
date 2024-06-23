export const sqlQueries = `
-- Create tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    premium BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    age INT,
    gender VARCHAR(50),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE swipes (
    id SERIAL PRIMARY KEY,
    swiper_id INT NOT NULL REFERENCES users(id),
    swiped_profile_id INT NOT NULL REFERENCES profiles(id),
    swipe_type VARCHAR(10) NOT NULL CHECK (swipe_type IN ('left', 'right')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE premium_packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_premium_purchases (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    premium_package_id INT NOT NULL REFERENCES premium_packages(id),
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create function to fetch profiles based on swipe limits and premium status
CREATE OR REPLACE FUNCTION get_profiles_by_user(usr_id INT)
RETURNS TABLE (
    profile_id INT,
    user_id INT,
    profile_name VARCHAR(100),
    profile_age INT,
    profile_gender VARCHAR(10),
    profile_bio TEXT,
    username VARCHAR(100),
    email VARCHAR(100)
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id AS profile_id,
        p.user_id,
        p.name AS profile_name,
        p.age AS profile_age,
        p.gender AS profile_gender,
        p.bio AS profile_bio,
        u.username,
        u.email
    FROM
        profiles p
    JOIN
        users u ON u.id = usr_id
    LEFT JOIN
        swipes s ON p.id = s.swiped_profile_id AND s.swiper_id = usr_id AND s.created_at >= CURRENT_DATE
    WHERE
        CASE
            WHEN u.premium = true THEN  -- If user is premium, no limit
                s.swiped_profile_id IS NULL
            ELSE  -- If user is not premium, check swipe count limit
                (
                    s.swiped_profile_id IS NULL
                    AND (
                        SELECT COUNT(*)
                        FROM swipes
                        WHERE swiper_id = usr_id
                        AND created_at >= CURRENT_DATE
                    ) <= 10
                )
        END;
END;
$$ LANGUAGE plpgsql;

-- Create function to swipe profiles
CREATE OR REPLACE FUNCTION swipe_profile(
    swiper_id_param INT,
    swiped_profile_id_param BIGINT,
    swipe_type_param VARCHAR
)
RETURNS VOID AS $$
DECLARE
    actions_today INT;
    is_premium BOOLEAN;
BEGIN
    -- Check if user is premium
    SELECT premium INTO is_premium FROM users WHERE id = swiper_id_param;

    -- Check if swiper has already swiped the profile today
    IF EXISTS (
        SELECT 1
        FROM swipes
        WHERE swiper_id = swiper_id_param
        AND swiped_profile_id = swiped_profile_id_param
        AND created_at >= CURRENT_DATE
    ) THEN
        RAISE EXCEPTION 'You have already swiped this profile today.';
    END IF;

    -- If user is premium, skip swipe limit check
    IF is_premium THEN
        -- Insert swipe record directly without limit check
        INSERT INTO swipes (swiper_id, swiped_profile_id, swipe_type, created_at)
        VALUES (swiper_id_param, swiped_profile_id_param, swipe_type_param, CURRENT_TIMESTAMP);
    ELSE
        -- Check if swiper has already swiped 10 profiles today
        SELECT COUNT(*)
        INTO actions_today
        FROM swipes
        WHERE swiper_id = swiper_id_param
        AND created_at >= CURRENT_DATE;

        -- Insert swipe record if actions today are less than 10
        IF actions_today < 10 THEN
            INSERT INTO swipes (swiper_id, swiped_profile_id, swipe_type, created_at)
            VALUES (swiper_id_param, swiped_profile_id_param, swipe_type_param, CURRENT_TIMESTAMP);
        ELSE
            RAISE EXCEPTION 'You have reached the maximum number of swipes allowed today.';
        END IF;
    END IF;

EXCEPTION
    WHEN others THEN
        RAISE EXCEPTION 'An error occurred in swipe_profile function: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Create function to purchase premium package
CREATE OR REPLACE FUNCTION purchase_premium_package(
    p_user_id INT,
    p_premium_package_id INT
)
RETURNS VOID AS $$
BEGIN
    -- Insert a new record into user_premium_purchases
    INSERT INTO user_premium_purchases (user_id, premium_package_id, purchased_at)
    VALUES (p_user_id, p_premium_package_id, CURRENT_TIMESTAMP);
    
    -- Update the user's premium status to true
    UPDATE users
    SET premium = TRUE
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;
`;
