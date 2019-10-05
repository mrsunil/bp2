using Microsoft.Extensions.Options;
using StackExchange.Redis;
using System;
using System.Linq;
using System.Net;

namespace LDC.Atlas.Services.MasterData.Model
{
    public interface IRedisConnectionFactory
    {
        ConnectionMultiplexer Connection();
    }

    public class RedisConnectionFactory : IRedisConnectionFactory
    {
        /// <summary>
        ///     The _connection.
        /// </summary>
        private readonly Lazy<ConnectionMultiplexer> _connection;

        public RedisConnectionFactory(IOptions<RedisConfiguration> redis)
        {
            _connection = new Lazy<ConnectionMultiplexer>(() =>
            {
                var ip = Dns.GetHostEntryAsync(redis.Value.CacheService).GetAwaiter().GetResult();
                ConfigurationOptions co = new ConfigurationOptions()
                {
                    SyncTimeout = 500000,
                    EndPoints =
                {
                    {
                        ip.AddressList.First(),
                        6379
                    }
                },
                    AbortOnConnectFail = false // this prevents that error
                };
                return ConnectionMultiplexer.Connect(co);
            });
        }

        public ConnectionMultiplexer Connection()
        {
            return _connection.Value;
        }
    }
}