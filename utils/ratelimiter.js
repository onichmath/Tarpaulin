require('dotenv').config();
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redis = require('redis');
const { ServerError, RateLimitError } = require('./error');

let redisClient;
const rateLimitWindowMilliseconds = 60000;
const rateLimitWindowMaxRequests = 50;

module.exports.connectToRedis = async () => {
    try{
        console.log(`Connecting to Redis at ${redisHost}:${redisPort}`);
        redisClient = redis.createClient({
            url: `redis://${redisHost}`
        });
        await redisClient.connect();
        redisClient.on('connect', () => {
            console.log('Connected to Redis');
        });
    } catch (err) {
        throw new ServerError('Error connecting to Redis:', err);
    }
}

module.exports.getRedisClient = () => {
    if (!redisClient) {
        throw new ServerError('Redis client not initialized');
    }
    return redisClient;
}


module.exports.rateLimiter = (req, res, next) => {
    return new Promise(async (resolve, reject) => {
        try {
            ip = req.ip;
            let tokenBucket = await getTokenBucket(ip);
            console.log(`IP: ${ip} | Tokens: ${tokenBucket.tokens} | Last: ${tokenBucket.last}`);

            if (tokenBucket.tokens > 0) {
              tokenBucket.tokens -= 1;
              await setTokens(ip, tokenBucket);
              return resolve();
            } 
            else {
              await setTokens(ip, tokenBucket);
              throw new RateLimitError('Rate limit exceeded');
            }
        } catch (err) {
            // throw new ServerError('Error getting token bucket:', err);
            if (err instanceof RateLimitError) {
                return reject(err);
            }
            // If error, turn off rate limiter
            return resolve;
        }
    });
}

async function setTokens(ip, tokenBucket) {
    await redisClient.hSet(ip, [
          ['tokens', tokenBucket.tokens],
          ['last', tokenBucket.last]
    ])
}

async function getTokens(tokenBucket) {
    const timestamp = Date.now();
    const elapsedMilliseconds = timestamp - tokenBucket.last;

    const refreshRate =
      rateLimitWindowMaxRequests / rateLimitWindowMilliseconds;
    const tokens_added = Math.floor(elapsedMilliseconds * refreshRate)

    tokenBucket.tokens += tokens_added;
    tokenBucket.tokens =
      Math.min(rateLimitWindowMaxRequests, tokenBucket.tokens);

    tokenBucket.last = timestamp
    return tokenBucket;
}

async function getTokenBucket(ip) {
    let tokenBucket = await redisClient.hGetAll(ip);

    tokenBucket = {
      tokens: parseFloat(tokenBucket.tokens) ||
        rateLimitWindowMaxRequests,
      last: parseInt(tokenBucket.last) || Date.now()
    }

    tokenBucket = await getTokens(tokenBucket);

    return tokenBucket;
}

