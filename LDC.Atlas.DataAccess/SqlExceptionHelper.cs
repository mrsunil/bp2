using System.Data.SqlClient;

namespace LDC.Atlas.DataAccess
{
    public static class SqlExceptionHelper
    {

        public static bool IsForeignKeyViolationException(this SqlException sqlException)
        {
            return sqlException.Number == 547;
        }
    }
}
