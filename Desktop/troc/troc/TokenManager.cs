using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace troc
{
    internal static class TokenManager
    {
        private const string TOKEN_KEY = "AuthToken";

        public static void SaveToken(string token)
        {
            try
            {
                Properties.Settings.Default.AuthToken = token;
                Properties.Settings.Default.Save();
                System.Diagnostics.Debug.WriteLine($"Token sauvegardé : {token}");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Erreur lors de la sauvegarde du token : {ex.Message}");
            }
        }

        public static bool IsTokenValid()
        {
            string token = GetToken();
            if (string.IsNullOrEmpty(token))
                return false;

            var handler = new JwtSecurityTokenHandler();
            if (handler.CanReadToken(token))
            {
                var jwtToken = handler.ReadJwtToken(token);
                var expClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "exp");
                if (expClaim != null)
                {
                    var expiration = DateTimeOffset.FromUnixTimeSeconds(long.Parse(expClaim.Value));
                    return expiration > DateTimeOffset.UtcNow;
                }
            }
            return false;
        }

        public static string GetToken()
        {
            return Properties.Settings.Default.AuthToken;
        }
    }
}
