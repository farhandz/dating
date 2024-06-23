## Description

[Hono](https://hono.dev) - [炎] means flame🔥 in Japanese - is a small, simple, and ultrafast web framework for the Edges.


```
[Postman Collection](https://elements.getpostman.com/redirect?entityId=8211085-758f39bd-ce64-4d3a-8780-33747b21111b&entityType=collection) - Postman Collection
```

## Requirements

- NodeJS v18.19.0 LTS/Hydrogen
- Bun v1.0.26

## Pre Install Package

- [husky](https://github.com/typicode/husky) - Git hooks made easy
- [zod](https://github.com/colinhacks/zod) - TypeScript schema validation with static type inference
- [luxon](https://github.com/moment/luxon) - A library for working with dates and times in JS
- [typeorm](https://github.com/typeorm/typeorm) - ORM for TypeScript and JavaScript
- [uuid](https://github.com/uuidjs/uuid) - Generate RFC-compliant UUIDs in JavaScript
- [crypto-js](https://github.com/brix/crypto-js) - JavaScript library of crypto standards
- [pg](https://github.com/brianc/node-postgres) - PostgreSQL client for node.js
- [oracledb](https://github.com/oracle/node-oracledb) - Oracle Database driver for Node.js
- [reflect-metadata](https://github.com/rbuckton/reflect-metadata) - Prototype for a Metadata Reflection API for ECMAScript

## Pre Installation

This application using [Bun](https://bun.sh) as Package Manager

- macOS, Linux, and WSL

```bash
$ curl -fsSL https://bun.sh/install | bash
```

- NPM

```bash
$ npm install -g bun
```

## Installation

```bash
# development
$ bun install

# production
$ bun install --production --frozen-lockfile --silent
```

## Running the app

```bash
# development
$ bun dev
$bun migrate

# production
$ bun run build
$ bun start
$bun migrate
```

# ESLint Configuration for TypeScript

This repository uses ESLint to lint and format TypeScript code. The configuration is defined in the `.eslintrc.js` file. Below is an overview of the settings and rules used:

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 13,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'eslint:recommended'
  ],
  env: {
    node: true,
    es2021: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist/*', 'node-modules/*'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      }
    ]
  },
};
```

# Project Folder Structure

- **/src**: Main source folder
  - **/helpers**: to save custom logic build in function
  - **/middleware**: middleware handle;
  - **/migration**: migraton script
  - **/route**: routing app
  - **/validation**: logic validation
   - **/module**: logic app/api 
   - **/stub**: otomation create bolilerplate



## Detail Service

```
senior backend engineer must be clean code and effective code 
```
### function get_profiles_by_user(user_id int)
as backend enginner must be strongest in sql script. Im was handle  **Premium user & non premium user** use this query 

this query result to handle **Same profiles can’t appear twice in the same day and validation limitaion profile show**
```
User Able to only view, swipe left (pass) and swipe right (like) 10 other dating profiles in
total (pass + like) in 1 day.
```
```
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
```

**code service just like this**
```
this code lest than 10 line of code beacuse this logic handle on query function pgsql
```

```
 export const profileswipe = async (
  swiper_id: string,
): Promise<profileType[]> => {
  const data = await GetProfilesBuilder(swiper_id);
  return data;
};
```

#### FUNCTION swipe_profile(swiper_id_param INT, swiped_profile_id_param BIGINT, swipe_type_param VARCHAR)

this function to action swiped profile by user login

```
it has validation swipe left (pass) and swipe right (like) 10 other dating profiles in
total (pass + like) in 1 day.
```

```
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
```

**code service just like this**
```
this code lest than 10 line of code beacuse this logic handle on query function pgsql
```

```
export const swipedProfile = async (body: SwipeProfile, swiper_id: number) => {
  try {
    await SwipeBuilder(
      swiper_id,
      body.swiped_profile_id,
      body.swipe_type_param,
    );
    return {
      message: `sukses swipe profile ${body.swiped_profile_id}`,
      data: null,
      code: 200,
    };
  } catch (error: any) {
    throw new HTTPException(500, {
      message: error.message,
    });
  }
};
```

### Handle Premium package

```
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
```




    


