using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Talent.Services.Profile.Models.Profile
{
    public class ExperienceViewModel
    {
        public string Id { get; set; }
        public string Company { get; set; }
        public string Position { get; set; }
        public string Responsibilities { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
    }
}
