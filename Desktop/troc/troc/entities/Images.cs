using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace troc.entities
{
    internal class Images
    {
        [JsonProperty("image_id")]
        public long ImageId { get; set; }

        [JsonProperty("imageUrl")]
        public string ImageUrl { get; set; }
    }
}
