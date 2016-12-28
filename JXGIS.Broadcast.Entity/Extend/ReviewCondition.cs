using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.Broadcast.Entity
{
    public class ReviewCondition
    {
        public DateTime beginDate { get; set; }

        public DateTime endDate { get; set; }

        public List<string> sourceType { get; set; }


        public List<string> catagory { get; set; }

        public List<string> status { get; set; }

        public string keyWord { get; set; }

        public int page { get; set; }
        public int rows { get; set; }

    }
}
